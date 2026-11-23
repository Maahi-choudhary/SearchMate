# SearchMate Security Policy

**Document version:** 1.0\
**Project:** SearchMate\
**Status:** Security requirements for the planned MVP\
**Based on:** SearchMate PRD v1.0, System Architecture v1.0, AI Coding
Agent Rules v1.0, Development Phases v1.0, Design Specification v1.0,
and Living Project Memory\
**Implementation status:** Planning document only. The project memory
records implementation as **NOT STARTED** and security tests as **NOT
RUN**.

------------------------------------------------------------------------

## 1. Purpose and Security Principles

This document defines the security requirements for SearchMate, an
AI-assisted research-paper analysis application. It is a set of
requirements and implementation guidance, not a claim that the controls
already exist.

SearchMate's security approach must follow these principles:

1.  **Private by default:** uploaded PDFs, extracted text, analyses, and
    derived evidence are private application data.
2.  **Validate at the backend:** browser-side checks improve usability
    but are never a security boundary.
3.  **Least privilege:** components and users should access only the
    data and operations they need.
4.  **Untrusted documents:** every uploaded PDF and all text extracted
    from it must be treated as untrusted input.
5.  **Evidence integrity:** AI-generated research claims must retain
    valid references to real papers and supporting evidence.
6.  **Secrets stay server-side:** the React frontend must never receive
    provider credentials or other secrets.
7.  **Safe failure:** errors must not disclose secrets, private paper
    content, internal paths, or database details.
8.  **Small MVP scope:** retain the approved modular-monolith
    architecture and do not introduce major infrastructure or
    authentication changes without approval.

## 2. Threat Model and Assets to Protect

### 2.1 System boundary

The planned MVP consists of:

-   React + Vite frontend.
-   Python + FastAPI backend exposing REST APIs over HTTPS.
-   SQLAlchemy with SQLite for the local/small MVP.
-   PyMuPDF for page-by-page PDF text extraction.
-   Private local upload storage or persistent disk.
-   Gemini accessed through a backend-only, replaceable AI-provider
    adapter.
-   TF-IDF and cosine similarity for lightweight retrieval/relationship
    analysis.
-   FastAPI background tasks for small workloads.

The browser, uploaded documents, external AI provider, and all
client-supplied request data must be considered outside the trusted
backend boundary.

### 2.2 Assets

  -----------------------------------------------------------------------
  Asset                   Why it matters          Required protection
  ----------------------- ----------------------- -----------------------
  Original research PDFs  May contain licensed,   Private storage, access
                          unpublished, or         checks, deletion
                          otherwise private       
                          material                

  Extracted page text and Reconstructs much of    Database access
  metadata                the original document   controls, safe logging,
                                                  deletion

  Analyses, themes,       May reveal a user's     Collection-level access
  comparisons, and Q&A    research interests and  control and integrity
                          conclusions             

  Paper/page evidence     Needed to verify        Referential validation
  references              generated claims        and integrity checks

  Collection and paper    Used to address stored  Opaque IDs plus
  identifiers             resources               authorization checks

  Gemini/API credentials  Can incur costs or      Backend-only secret
                          grant access to         storage and rotation
                          provider services       

  Database and upload     Contain user data and   Filesystem permissions,
  directory               application state       backups, restricted
                                                  access

  Application             Controls origins,       Controlled deployment
  configuration           paths, limits, and      configuration
                          provider settings       

  Logs and diagnostics    May contain operational Minimise, redact,
                          or user information     restrict, and expire
  -----------------------------------------------------------------------

### 2.3 Threat actors and likely threats

-   **Unauthenticated internet users:** attempt to access, enumerate,
    modify, or delete collections and papers.
-   **Malicious or compromised users:** submit malformed requests,
    oversized files, hostile PDFs, or repeated expensive AI requests.
-   **Malicious document authors:** embed prompt-injection instructions,
    misleading content, malformed PDF structures, or content intended to
    exploit parsers.
-   **Compromised dependencies or build pipeline:** introduce malicious
    code or known vulnerable packages.
-   **Accidental insiders or developers:** expose secrets, commit
    private PDFs, log document contents, or misconfigure storage and
    CORS.
-   **External service compromise or misuse:** expose data sent to the
    AI provider or leak provider credentials.

### 2.4 Main security risks

-   Broken object-level authorization (accessing another user's
    collection by changing an ID).
-   Unrestricted upload, parser exploitation, storage exhaustion, or
    path traversal.
-   Prompt injection through PDF text or retrieved evidence.
-   Secret leakage through frontend bundles, Git, logs, exceptions, or
    API responses.
-   SQL injection or unsafe database access.
-   Cross-site scripting (XSS) through rendered paper text or model
    output.
-   Cross-origin abuse, CSRF where cookie-based authentication is used,
    and API abuse.
-   Excessive AI-provider use causing cost or quota exhaustion.
-   Unintended retention or disclosure of uploaded research documents.
-   Dependency compromise or vulnerable PDF-processing libraries.

## 3. Authentication and Authorization

### 3.1 MVP status and boundary

The approved initial architecture explicitly avoids introducing a full
authentication system without approval. The current project memory also
records implementation as not started. Therefore:

-   Do not claim that SearchMate currently supports login, accounts,
    roles, or user ownership.
-   A local, single-user development prototype must not be assumed safe
    for unrestricted public access.
-   Before exposing a deployed instance to multiple or untrusted users,
    an approved authentication and ownership design is required.
-   Adding authentication or a new permission model is a major
    architecture change and requires explicit owner approval under
    `rules.md`.

### 3.2 Requirements if authentication is implemented

-   Use a maintained authentication library or trusted identity
    provider; do not design custom password cryptography.
-   Require HTTPS for login and all authenticated application traffic.
-   Store passwords only using a modern password-hashing algorithm with
    an appropriate work factor, if passwords are managed by SearchMate.
-   Use secure session cookies (`HttpOnly`, `Secure`, and an appropriate
    `SameSite` setting) when using cookie sessions.
-   Protect cookie-authenticated state-changing requests against CSRF.
-   Apply session expiration, logout invalidation, and secure session
    renewal.
-   Avoid revealing whether a username or email address exists in
    authentication error messages.
-   Add account recovery only through a secure, time-limited process.
-   Require re-authentication for sensitive account/security changes
    where appropriate.
-   Never store authentication tokens in URLs or expose them in logs.

### 3.3 Authorization requirements

-   Every collection, paper, page, analysis, citation, and evidence
    endpoint must verify that the requesting principal is allowed to
    access the parent collection.
-   Perform authorization on the backend for every request; hiding UI
    controls is not authorization.
-   Do not rely on UUIDs or opaque IDs as a substitute for access
    control.
-   Check ownership before reading, downloading, updating, reprocessing,
    or deleting an object.
-   Ensure child records inherit the access boundary of their parent
    collection.
-   Prevent insecure direct object reference (IDOR) attacks by testing
    cross-user access with substituted IDs.
-   Restrict administrative and maintenance operations to trusted
    operators.
-   Return a generic `404` or other consistent non-disclosing response
    for resources the caller is not permitted to discover.

### 3.4 Single-user prototype deployment

Until authentication and ownership are implemented, keep the service
local or restrict access at the hosting/network layer to the intended
operator. Do not advertise a publicly reachable, multi-user deployment
as private or account-isolated.

## 4. Input Validation and Output Encoding

### 4.1 API request validation

-   Validate all request bodies, query parameters, path parameters, and
    headers that affect application behaviour using Pydantic or
    equivalent explicit schemas.
-   Enforce field types, allowed values, string lengths, collection
    limits, and sensible numeric bounds.
-   Reject unexpected or malformed input rather than silently accepting
    ambiguous values.
-   Use UUIDs or generated opaque identifiers for collections, papers,
    and insights as planned.
-   Keep REST endpoints under `/api/v1` and return consistent error
    shapes.
-   Do not expose internal filesystem paths, stack traces, SQL
    statements, provider credentials, or implementation-only fields in
    API responses.
-   Apply validation in backend services as well as at route boundaries
    when data crosses trust boundaries.

### 4.2 Database input handling

-   Use SQLAlchemy parameterised ORM operations or bound parameters.
-   Never build SQL queries by concatenating untrusted strings.
-   Validate sorting, filtering, and field-selection parameters against
    explicit allowlists.
-   Avoid accepting arbitrary SQL fragments, file paths, model names, or
    provider configuration from clients.

### 4.3 Output encoding and rendering

-   Treat extracted PDF text, filenames, metadata, user questions, and
    AI output as untrusted when displayed.
-   Render plain text as text; do not inject it into the DOM as raw
    HTML.
-   Avoid React `dangerouslySetInnerHTML`. If rich HTML is ever
    required, use a maintained HTML sanitizer with a strict allowlist
    and review the need first.
-   Encode output for its destination context (HTML, attributes, URLs,
    JavaScript, or logs); one generic escaping step is not sufficient
    for every context.
-   Validate URL schemes before rendering clickable links. Do not allow
    `javascript:` or other active schemes.
-   Do not construct file download paths from user-provided filenames.
-   Keep error messages actionable but generic; log detailed diagnostics
    only in protected server logs.

## 5. Secrets and Environment Variable Management

### 5.1 Required practices

-   Store Gemini credentials and all other secrets only in backend
    environment variables or an approved secret manager.
-   The React application must never call Gemini directly and must never
    contain provider API keys.
-   Never commit `.env`, real credentials, tokens, private keys,
    database credentials, uploaded PDFs, local database files, or logs.
-   Maintain `.env.example` with placeholder values and descriptions
    only.
-   Add `.env`, upload directories, local databases, caches, virtual
    environments, `node_modules`, and build output to `.gitignore`.
-   Do not include secrets in frontend `VITE_*` variables; frontend
    build-time variables are public.
-   Do not expose secrets through API responses, exception messages,
    screenshots, telemetry, or debug endpoints.
-   Restrict production secret access to the smallest set of services
    and operators that need it.
-   Use separate credentials for development and production.
-   Rotate credentials immediately if they are suspected to have been
    exposed; revoke the old credential.
-   Avoid printing complete environment configurations in logs or
    support diagnostics.

### 5.2 Configuration

Document and validate configuration such as:

-   `DATABASE_URL`
-   `UPLOAD_DIR`
-   `MAX_FILE_SIZE_MB`
-   `MAX_PAPERS_PER_COLLECTION`
-   AI provider credentials and model configuration

The project phases recommend an initial maximum of 10 MB per PDF and 5
PDFs per collection. These are starting application limits, not
substitutes for host-level request-size limits.

## 6. Database and API Security

### 6.1 Database

-   Keep SQLite database files outside public/static frontend
    directories.
-   Apply restrictive filesystem permissions to the database and its
    containing directory.
-   Do not expose SQLite files through a static file server or public
    route.
-   Use SQLAlchemy and repository-layer access as planned; keep raw
    database operations out of route handlers.
-   Define foreign keys and deletion behaviour for dependent records.
-   Use transactions for multi-record operations so partial failures do
    not leave inconsistent ownership or evidence relationships.
-   Validate that citations and evidence records reference real paper
    and page/chunk records.
-   Back up the database securely and protect backups at least as
    strongly as the live database.
-   Do not silently delete or recreate a database during migrations or
    development.
-   If the service expands to concurrent multi-user use, review the
    approved SQLite choice and obtain approval before migrating to
    PostgreSQL.

### 6.2 API transport and configuration

-   Require HTTPS in deployed environments; redirect HTTP to HTTPS at
    the edge where supported.
-   Configure CORS to allow only the intended frontend origin(s). Do not
    use wildcard origins with credentials.
-   Disable or restrict interactive API documentation endpoints in
    production if they expose unnecessary surface area.
-   Set request body and header size limits at the application and
    hosting layers.
-   Use explicit timeouts for inbound requests and outbound AI-provider
    calls.
-   Do not expose internal service ports or development servers to the
    public internet.
-   Keep health checks minimal; do not include secrets, environment
    dumps, database contents, or internal paths.

### 6.3 Error handling and logging

-   Return stable, predictable API errors without stack traces or
    sensitive data.
-   Log request IDs, operation type, outcome, and safe diagnostic
    metadata where useful.
-   Do not log full paper contents, full prompts containing private
    document text, API keys, access tokens, or raw authentication
    credentials.
-   Sanitize untrusted values before including them in logs to prevent
    log injection.
-   Restrict log access and configure a retention period appropriate to
    operational needs.

## 7. Data Privacy and Retention

### 7.1 Data minimisation

-   Collect only information required to create collections, process
    papers, and provide the requested research analysis.
-   Do not require personal information that is not needed for the
    product.
-   Avoid collecting sensitive account or profile details in the MVP.
-   Explain to users when paper text is sent to the configured external
    AI provider.

### 7.2 Uploaded documents and AI provider

-   Treat uploaded papers and extracted text as private user content.
-   Do not use uploaded documents for model training unless the user has
    explicitly agreed and the provider's terms permit it.
-   Review the selected provider's current data handling, retention, and
    training terms before production use; do not assume a particular
    provider policy.
-   Send only the relevant text needed for the requested analysis or
    question.
-   Avoid repeatedly sending the full text of every paper for every
    question; use relevant retrieved chunks and preserve paper/page
    metadata.
-   Do not send uploaded content to unrelated third-party services.

### 7.3 Deletion and retention

-   Provide a way to delete uploaded papers and their associated
    extracted text, metadata, analyses, chunks, citations, and derived
    records.
-   Ensure deletion covers the original file and all dependent data, not
    just the visible paper record.
-   Define and document a retention period for operational logs,
    backups, and any provider-side data according to deployment and
    provider capabilities.
-   Do not claim immediate deletion from backups or third-party systems
    unless that behaviour is verified and supported.
-   Make deletion operations safe, authorised, and auditable without
    logging the document content itself.
-   Keep backups access-controlled and expire them according to the
    documented backup lifecycle.

### 7.4 Privacy transparency

Before production release, provide a concise privacy notice that
explains: - What files and related data are stored. - Why data is
processed and which external AI provider receives relevant text. -
Whether the provider may retain submitted content and under what
verified terms. - How users can delete papers and associated data. - Any
known retention periods or operational limitations.

## 8. Rate Limiting and Abuse Prevention

The source documents require request limits and AI-provider quota
handling but do not define exact per-route thresholds. The following
controls are required; numerical thresholds should be selected and
load-tested before public deployment.

-   Apply rate limits to upload, analysis, Q&A, collection creation, and
    other resource-intensive endpoints.
-   Use per-user limits when authentication exists; otherwise use a
    combination of IP-based limits and deployment-level access
    restrictions appropriate to the single-user prototype.
-   Enforce the configured maximum of 5 PDFs per collection and the
    suggested 10 MB per PDF.
-   Limit concurrent uploads, PDF extraction jobs, and AI-provider
    calls.
-   Set maximum request sizes, processing timeouts, and outbound
    provider timeouts.
-   Apply per-user or per-deployment AI token/request budgets where
    supported.
-   Handle provider quota errors and timeouts without uncontrolled retry
    loops.
-   Use bounded retries with backoff for transient provider failures; do
    not retry invalid requests.
-   Cache extracted metadata and analysis where practical to avoid
    repeated expensive processing.
-   Make expensive operations idempotent where feasible so client
    retries do not trigger duplicate work.
-   Return `429 Too Many Requests` with a safe retry indication when a
    rate limit is exceeded.
-   Monitor unusual request volume, repeated failures, and sudden AI
    usage increases without collecting full paper text.

## 9. File Upload Security

PDF upload is a core SearchMate feature and must be treated as a
high-risk boundary.

### 9.1 Validation

-   Validate on the backend before extraction.
-   Check the file extension, declared content type, PDF signature, and
    actual parser readability; do not trust the filename or browser
    validation alone.
-   Enforce the configured maximum file size and maximum of 5 PDFs per
    collection.
-   Reject unsupported, corrupt, encrypted, and text-empty/scanned-only
    PDFs with clear error codes, as defined by the MVP workflow.
-   Do not accept arbitrary file types through the PDF endpoint.
-   Consider limits on page count, extracted text size, and processing
    duration to reduce resource-exhaustion risk.
-   Treat parser errors as a failed/unsupported paper, not as a
    successful analysis.

### 9.2 Storage

-   Generate safe server-side filenames or opaque storage keys.
-   Never use an untrusted filename as a filesystem path.
-   Store PDFs in private storage outside the frontend's public/static
    directory.
-   Do not expose raw filesystem paths to the browser.
-   Ensure users can retrieve a file only through an authorised backend
    operation.
-   Apply restrictive filesystem permissions to upload directories.
-   Do not commit uploaded research papers or generated private user
    data to Git.

### 9.3 Processing

-   Treat PyMuPDF and all document parsers as attack surfaces; keep them
    patched.
-   Process documents with resource limits and timeouts.
-   Do not execute embedded scripts, launch attachments, or follow
    external links contained in PDFs.
-   Keep document extraction separate from API routing and AI-provider
    logic.
-   Preserve original page numbers and evidence references, but do not
    trust document-provided metadata as authoritative without
    validation.
-   If malware scanning is added later, it must run server-side and must
    not be treated as a replacement for file validation or parser
    isolation.

### 9.4 Download and deletion

-   Authorise every download against the parent collection.
-   Use safe content-disposition headers and avoid reflecting untrusted
    filenames into headers without sanitisation.
-   Delete the stored file and associated extracted/derived records when
    a paper is deleted.
-   Handle failed deletion safely and record a non-sensitive operational
    event for follow-up.

## 10. AI/LLM-Specific Risks

### 10.1 Prompt injection and untrusted content

-   Treat every PDF, extracted page, retrieved chunk, filename, metadata
    field, and user question as untrusted input.
-   Instructions embedded in a paper must never override application,
    system, or developer instructions.
-   Clearly separate trusted application instructions from document
    evidence in prompts.
-   Tell the model that document text is source material to analyse, not
    instructions to follow.
-   Do not include secrets, internal prompts, environment values, or
    privileged system information in model context.
-   Do not allow document content to trigger tools, external network
    requests, file access, or privileged backend actions.
-   Keep model calls behind the backend AI-provider adapter.

### 10.2 Retrieval and evidence integrity

-   Use the uploaded collection as the evidence source for
    collection-specific answers; do not silently supplement with web
    knowledge or model assumptions.
-   Retrieve relevant chunks rather than sending every full paper for
    every question.
-   Preserve paper IDs, page numbers, and evidence identifiers through
    extraction, retrieval, generation, and persistence.
-   Validate every citation against a real paper and, for Q&A, a
    retrieved evidence chunk.
-   Reject or mark output whose citations cannot be resolved.
-   If the uploaded collection does not support an answer, say that
    there is not enough information in the uploaded papers.
-   Do not invent authors, titles, years, datasets, metrics, findings,
    limitations, future-work statements, or citations.

### 10.3 Structured output and model reliability

-   Validate all structured AI responses against Pydantic schemas before
    saving or displaying them.
-   Enforce field types, lengths, allowed values, citation references,
    and required fields.
-   Treat model output as untrusted even when it is valid JSON.
-   Do not execute generated code, SQL, shell commands, HTML, or tool
    instructions.
-   Do not present partial, failed, or schema-invalid output as a
    completed analysis.
-   Separate author-stated facts from AI-generated interpretation.
-   Mark missing information as `Not found in paper` or the established
    null value.
-   Label collection-based gaps as potential gaps, not proof of novelty.
-   Label project directions as ideas to investigate, not verified novel
    contributions.
-   Mark uncertain comparisons as requiring manual verification rather
    than asserting contradictions.

### 10.4 Provider controls

-   Keep provider credentials on the backend.
-   Use explicit timeouts, bounded retries, and quota handling.
-   Minimise the amount of document content sent to the provider.
-   Review provider data retention and training terms before release.
-   Keep the provider behind the approved adapter so it can be replaced
    without exposing provider-specific details to the frontend.
-   Record provider/model configuration changes and review their
    privacy, cost, and security impact.

## 11. Dependency and Supply-Chain Security

-   Use the approved stack unless a change is explicitly approved:
    React + Vite, FastAPI, PyMuPDF, Pydantic, SQLAlchemy, SQLite, Gemini
    through an adapter, and scikit-learn.
-   Pin or constrain dependency versions and commit the appropriate
    lockfiles where supported.
-   Install packages from trusted registries and verify package names to
    reduce dependency-confusion and typosquatting risk.
-   Review new dependencies for maintenance status, security history,
    license, transitive dependencies, and data/network behaviour.
-   Keep Python and JavaScript dependencies updated with a controlled
    patch process.
-   Run dependency vulnerability checks regularly and before release.
-   Remove unused packages and avoid adding dependencies for
    functionality already provided by the stack.
-   Protect GitHub and deployment credentials; use least-privilege
    repository and CI permissions.
-   Do not run untrusted pull-request code with production secrets.
-   Protect the default branch with review and required checks where the
    repository workflow supports it.
-   Build and deploy from reviewed source; restrict who can publish
    production releases.
-   Never commit secrets, `.env`, uploads, local databases, logs,
    caches, or build artifacts.

## 12. Security Testing Checklist

Run and record these checks before any public deployment. A checked box
means the test was actually performed and passed; do not mark items
complete based only on code inspection.

### 12.1 Authentication and authorization

-   [ ] Confirm the deployment is not publicly exposed without an
    approved access-control design.
-   [ ] If authentication exists, test login, logout, session expiry,
    and invalid credentials.
-   [ ] If ownership exists, attempt cross-user access to collections,
    papers, pages, analyses, citations, and downloads.
-   [ ] Test guessed, modified, malformed, and unknown resource IDs.
-   [ ] Verify unauthorised read, update, delete, and reprocess requests
    are denied.

### 12.2 Input validation and output encoding

-   [ ] Submit missing, malformed, oversized, and unexpected API fields.
-   [ ] Test invalid UUIDs and invalid pagination/filter/sort values.
-   [ ] Verify database operations use parameterised ORM/bound queries.
-   [ ] Display hostile HTML/script-like strings from filenames,
    extracted text, and model output; confirm they render as text.
-   [ ] Verify unsafe URL schemes are rejected.
-   [ ] Confirm errors do not reveal stack traces, SQL, paths, or
    secrets.

### 12.3 Secrets and configuration

-   [ ] Search the repository and built frontend assets for real
    credentials and tokens.
-   [ ] Confirm no provider key is present in frontend source, build
    output, or API responses.
-   [ ] Confirm `.env`, local databases, uploads, and logs are ignored
    by Git.
-   [ ] Confirm `.env.example` contains placeholders only.
-   [ ] Verify production CORS contains only approved frontend origins.
-   [ ] Verify HTTPS is enforced in the deployed environment.

### 12.4 Database and API

-   [ ] Test SQL-injection-style input against search, filter, and other
    data fields.
-   [ ] Confirm database files are not publicly downloadable.
-   [ ] Test consistent error responses and safe health-check output.
-   [ ] Verify timeouts and request-size limits.
-   [ ] Verify deletion and foreign-key behaviour for dependent records.
-   [ ] Confirm backups are access-controlled.

### 12.5 File upload and processing

-   [ ] Upload a valid supported text-based PDF.
-   [ ] Test wrong extensions, wrong MIME types, invalid signatures,
    corrupt PDFs, encrypted PDFs, and empty/scanned-only PDFs.
-   [ ] Test files above the configured size limit and collections above
    the 5-paper limit.
-   [ ] Test unusual filenames, path traversal strings, and duplicate
    filenames.
-   [ ] Confirm server-generated storage names are used.
-   [ ] Confirm files are stored outside public/static directories.
-   [ ] Test parser timeouts and resource limits.
-   [ ] Confirm failed uploads do not leave orphaned files or
    inconsistent records.
-   [ ] Confirm deletion removes the file and associated
    extracted/derived data.

### 12.6 AI and evidence

-   [ ] Test PDFs containing instructions that attempt to override the
    system or reveal secrets.
-   [ ] Confirm document instructions are treated as untrusted source
    text.
-   [ ] Test malformed, incomplete, and schema-invalid AI responses.
-   [ ] Test fabricated, unknown, or mismatched paper/page citations.
-   [ ] Confirm unsupported answers state that the uploaded collection
    does not provide enough information.
-   [ ] Confirm no model output is executed as code, SQL, HTML, or a
    privileged command.
-   [ ] Confirm partial or failed analyses are not presented as
    completed results.
-   [ ] Confirm logs do not contain full paper text, sensitive prompts,
    or provider credentials.

### 12.7 Abuse, dependencies, and release

-   [ ] Test rate limits for uploads, analysis, Q&A, and collection
    creation.
-   [ ] Test concurrent requests and repeated retries.
-   [ ] Confirm AI quota failures do not cause unbounded retries.
-   [ ] Run dependency vulnerability checks for Python and JavaScript
    packages.
-   [ ] Review newly added dependencies and lockfile changes.
-   [ ] Run backend tests with Pytest + HTTPX.
-   [ ] Run configured frontend tests with Vitest.
-   [ ] Run lint/build checks configured by the repository.
-   [ ] Review the final diff and Git status for unrelated files,
    secrets, uploads, and local data.
-   [ ] Record the exact commands, results, and unresolved risks.

## 13. Incident and Vulnerability Handling

### 13.1 Reporting

A suspected vulnerability or security incident should be reported
promptly to the project owner or designated maintainer through a private
channel. Do not publish exploit details, credentials, or affected user
documents in public issues.

A report should include, where safe:

-   A concise description and affected component.
-   Impact and potential data or service exposure.
-   Reproduction steps or evidence, avoiding access to other users'
    data.
-   Approximate discovery time and relevant request/log identifiers.
-   Any known mitigation already applied.

### 13.2 Initial response

1.  Acknowledge and record the report privately.
2.  Triage severity based on confidentiality, integrity, availability,
    exploitability, and affected users.
3.  Preserve relevant logs and system state without copying unnecessary
    private paper contents.
4.  Contain the issue: disable the affected endpoint or feature,
    restrict access, revoke exposed credentials, or take the affected
    service offline if needed.
5.  Determine the scope of affected collections, files, accounts,
    credentials, and external services.
6.  Fix the root cause and add regression tests.
7.  Deploy the fix through the normal reviewed release process.
8.  Verify the remediation and monitor for recurrence.
9.  Notify affected users and relevant parties when required by
    applicable law, contract, or provider obligations.

### 13.3 Credential exposure

If a secret is exposed:

-   Revoke or rotate it immediately.
-   Remove it from active configuration and check for unauthorised use.
-   Review repository history, CI logs, deployment logs, and frontend
    build artifacts for further exposure.
-   Do not assume deleting the visible file removes a secret from Git
    history or prior build artifacts.
-   Record the incident and add a regression/prevention check.

### 13.4 Vulnerability remediation

-   Prioritise actively exploited, remotely exploitable, and
    data-exposing vulnerabilities.
-   Upgrade affected dependencies to a patched compatible version after
    testing.
-   If no safe patch is available, disable or isolate the vulnerable
    functionality and document the temporary mitigation.
-   Do not suppress vulnerability alerts without documenting the
    rationale and compensating controls.
-   Re-test the affected feature and adjacent workflows after
    remediation.

### 13.5 Incident record

Maintain a private incident record containing:

-   Incident identifier and dates.
-   Reporter and responsible maintainer.
-   Affected systems and data categories.
-   Severity and impact assessment.
-   Containment, remediation, and verification steps.
-   User/provider notifications, if applicable.
-   Follow-up actions and lessons learned.

Do not include passwords, API keys, access tokens, or unnecessary copies
of private documents in the incident record.

## 14. Deployment Readiness Gate

Do not describe SearchMate as ready for public multi-user use until all
applicable items below are verified:

-   [ ] Public deployment has an approved authentication/authorization
    boundary, or is intentionally restricted to a single trusted
    operator.
-   [ ] HTTPS is enforced and production CORS is restricted.
-   [ ] Provider credentials are stored only in backend
    secrets/configuration.
-   [ ] PDFs and extracted data are stored privately.
-   [ ] Upload validation and processing limits are enforced
    server-side.
-   [ ] Collection ownership checks protect every resource endpoint if
    multiple users are supported.
-   [ ] AI prompt-injection and citation-validation checks have been
    tested.
-   [ ] Rate limits and AI usage controls are configured.
-   [ ] Deletion behaviour covers original and derived data.
-   [ ] Logs and errors do not expose private content or secrets.
-   [ ] Dependency checks and relevant automated tests have passed.
-   [ ] Privacy notice, retention expectations, and incident
    contact/process are documented.
-   [ ] Known limitations and unresolved risks are recorded.

------------------------------------------------------------------------

## 15. Project-Specific Notes and Open Decisions

The following are not settled by the current project documents and must
not be represented as existing features:

1.  **Authentication:** full authentication and a multi-user ownership
    model are not part of the approved initial MVP without explicit
    approval.
2.  **Rate-limit thresholds:** the project requires request limits and
    AI quota handling, but exact numeric thresholds are not yet
    specified.
3.  **Retention periods:** deletion is required, but exact retention
    periods for logs, backups, and provider-side data are not specified.
4.  **Malware scanning and parser isolation:** not specified as
    implemented MVP infrastructure; consider only after reviewing cost,
    architecture, and deployment impact.
5.  **Production privacy terms:** the selected AI provider's current
    retention/training terms must be checked before release.
6.  **Implementation verification:** the living project memory records
    that implementation has not started and tests have not been run. All
    checklist items therefore begin unchecked.

Any change that introduces authentication, roles, multi-user ownership,
a new database, storage provider, queue, or other major infrastructure
requires explicit owner approval as described in `rules.md`.

## 16. Source Documents

This policy is grounded in the following SearchMate project documents:

-   `SearchMate_PRD.md` --- product scope, security/privacy
    non-functional requirements, upload constraints, and AI integrity
    expectations.
-   `SearchMate_Architecture.md` --- modular-monolith design, approved
    technology stack, private upload storage, server-side AI
    integration, and architecture acceptance checklist.
-   `rules.md` --- mandatory engineering, AI integrity, security,
    privacy, and change-control rules.
-   `phases.md` --- implementation sequence, upload validation tasks,
    configuration, and security/testing phase.
-   `design.md` --- safe UI/error-state and accessibility expectations
    relevant to secure presentation.
-   `memory.md` --- confirmed project decisions and current
    implementation status.

**Final principle:** Protect user research documents, keep secrets on
the backend, treat all document and model content as untrusted, and
preserve verifiable evidence for every important AI-generated research
claim.

------------------------------------------------------------------------

## 17. Interactive Graph Security and Evidence-Integrity Requirements

The graph is a read-oriented visualization of collection data, but it
introduces additional ways to expose private information or render
untrusted content. These requirements apply to both essential MVP graph
functionality and advanced post-MVP graph extensions.

### 17.1 Collection isolation and authorization

-   Every graph request must be authorized against the requested
    collection before graph records are queried or returned.
-   Verify that every node, edge endpoint, and evidence reference
    belongs to the same authorized collection.
-   Do not trust collection IDs, paper IDs, node IDs, or edge IDs
    supplied by the browser; resolve them server-side.
-   Apply the same authorization checks to node details, edge details,
    and evidence-navigation endpoints.
-   Do not expose whether another user's collection or paper ID exists
    through distinguishable error messages.

### 17.2 Graph payload validation

-   Validate graph response objects with Pydantic or equivalent strict
    schemas.
-   Restrict node types and relationship types to enumerated values.
-   Require unique node and edge identifiers within the response.
-   Require every edge endpoint to resolve to a node in the same
    response.
-   Require evidence references to resolve to real paper/evidence
    records in the authorized collection.
-   Bound node counts, edge counts, label lengths, metadata sizes, and
    filter parameters to reduce resource-exhaustion risk.
-   Treat all extracted paper text, titles, theme labels,
    model-generated descriptions, and evidence excerpts as untrusted
    data.

### 17.3 Frontend rendering and browser safety

-   Render node labels, edge labels, metadata, and evidence excerpts as
    text; do not inject them as trusted HTML.
-   If rich text is required, use a well-maintained sanitizer with a
    restrictive allowlist.
-   Do not construct executable SVG, HTML, or event-handler attributes
    from document or model content.
-   Avoid unsafe URL schemes in evidence links. Use
    application-generated internal routes or allowlisted destinations.
-   Do not put secrets, private document contents, or authorization
    tokens in graph URLs, browser logs, analytics events, or client-side
    error reports.
-   Ensure graph library dependencies are reviewed and pinned according
    to the project's dependency policy.

### 17.4 Evidence integrity and AI-specific risks

-   An edge must not be returned merely because an LLM proposed it; it
    must map to validated relationship records and supporting evidence.
-   Similarity-derived links must be labelled as system-computed
    relationships, not author-stated facts.
-   Page numbers and evidence IDs must be validated against stored
    extraction records.
-   Advanced research-gap and conflicting-finding nodes must link to the
    underlying limitations or claims and clearly state uncertainty.
-   A potential gap in the uploaded collection must never be represented
    as proof of global novelty.
-   A difference between findings must not be labelled a contradiction
    without contextual evidence.

### 17.5 Abuse prevention and privacy

-   Apply existing rate limits to graph retrieval and detail endpoints;
    do not allow repeated requests to trigger new expensive AI analysis
    by default.
-   Cache only collection-scoped graph data and ensure cache keys
    include the authorized collection boundary.
-   Do not log full graph payloads or evidence excerpts by default. Log
    request IDs, outcome, and bounded operational metadata.
-   Graph search and filters should operate on already authorized data
    and must not broaden access.
-   Reset, filter, search, and layout actions are view-only and must not
    delete or alter stored papers or analysis.

### 17.6 Additional graph security tests

-   [ ] A user cannot retrieve another collection's graph by changing
    the collection ID.
-   [ ] Cross-collection node/edge/evidence references are rejected.
-   [ ] Duplicate IDs, invalid node types, invalid relationship types,
    and dangling edge endpoints are rejected.
-   [ ] Oversized graph payloads and excessively long labels are
    bounded.
-   [ ] Malicious HTML/script-like labels and evidence excerpts render
    as inert text.
-   [ ] Unsafe URL schemes are rejected or not rendered as links.
-   [ ] Missing or deleted evidence records do not produce fabricated
    references.
-   [ ] Graph endpoints do not trigger unbounded AI calls.
-   [ ] Logs do not contain secrets or full private paper content.
-   [ ] Advanced gap/conflict labels preserve uncertainty and evidence
    provenance.
