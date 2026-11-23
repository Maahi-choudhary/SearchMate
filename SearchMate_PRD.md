# SearchMate --- Product Requirements Document (PRD)

**Document version:** 1.0\
**Status:** MVP specification\
**Product type:** AI-assisted research paper analysis web application\
**Primary audience:** College students and beginner researchers\
**MVP delivery target:** 1--2 weeks (individual developer)

------------------------------------------------------------------------

## 1. Product Overview

### 1.1 Product summary

SearchMate is a beginner-friendly web application that helps students
understand how multiple research papers relate to one another. Users
upload research-paper PDFs and receive clear, structured explanations of
each paper, shared themes, differences in findings, possible research
gaps, and beginner-friendly project directions.

Unlike tools that mainly summarise papers or display dense academic
graphs, SearchMate focuses on **making research easier to understand and
explore**. It should explain connections in simple language and let
users move from one insight to its supporting papers.

### 1.2 Product vision

Help students move from *reading individual papers* to *understanding
the bigger picture of a research topic*---without needing advanced
research experience.

### 1.3 Problem statement

Students exploring a research topic often collect several papers but
struggle to:

-   Understand unfamiliar academic terminology and complex explanations.
-   Identify common themes, methods, datasets, and findings across
    papers.
-   See where papers agree, disagree, or build on earlier work.
-   Recognise limitations and research gaps mentioned by authors.
-   Decide what topic or project they could explore next.

Existing research tools may overwhelm beginners with dense graphs,
technical language, complicated interfaces, limited free access, or
connections that are difficult to interpret. A tool that only summarises
papers does not adequately explain how the papers fit together.

### 1.4 Proposed solution

SearchMate will let users upload a small collection of research PDFs and
explore the collection through five connected capabilities:

1.  **Paper understanding:** Extract and explain key information from
    each paper in simple language.
2.  **Research connections:** Identify shared topics, keywords, methods,
    and findings.
3.  **Gap and limitation discovery:** Collect stated limitations and
    highlight recurring underexplored areas as *potential* gaps.
4.  **Comparison and trends:** Compare findings and methods, and show a
    simple publication-year timeline.
5.  **Research exploration:** Answer questions using uploaded papers and
    suggest project directions grounded in identified gaps.

Every important insight should link back to the paper and, where
possible, the page or section that supports it.

------------------------------------------------------------------------

## 2. Goals and Measurable Success Criteria

### 2.1 Product goals

-   Make multi-paper research understandable to students with limited
    research experience.
-   Reduce the effort needed to compare a small collection of papers.
-   Make relationships between papers clear without overwhelming
    visualisations.
-   Help users identify possible research opportunities while avoiding
    unsupported claims.
-   Keep the MVP simple, usable, and affordable to run.

### 2.2 MVP success metrics

  ---------------------------------------------------------------------
  Goal                 Success measure                       MVP target
  -------------------- -------------------- ---------------------------
  Easy onboarding      A first-time user       At least 4 out of 5 test
                       can upload papers                          users
                       and reach the        
                       analysis page        
                       without assistance   

  Useful paper         Required fields are  At least 80% of test papers
  extraction           extracted for                 have usable title,
                       supported PDFs               abstract, year, and
                                                  keywords or key terms

  Understandable       Test users rate            Average 4/5 or higher
  explanations         explanations as easy 
                       to understand        

  Useful comparisons   Users can identify      At least 4 out of 5 test
                       at least one                               users
                       meaningful           
                       similarity or        
                       difference           

  Evidence             Generated claims               100% of displayed
  traceability         show a source-paper        AI-generated research
                       reference                 claims include a paper
                                                              reference

  Usable performance   A small collection    Target under 2 minutes for
                       completes processing    3 short, text-based PDFs
                       within a reasonable            under normal test
                       wait                                  conditions

  Stability            Supported PDFs can       At least 90% successful
                       be uploaded and       processing in the test set
                       processed without    
                       application failure  
  ---------------------------------------------------------------------

**Measurement note:** These are prototype targets, not guaranteed
performance. Evaluate them using a small, manually checked set of
research PDFs.

### 2.3 Non-goals

SearchMate MVP is not intended to:

-   Replace a literature review or expert research supervision.
-   Prove that a research gap is genuinely novel.
-   Guarantee the correctness of every conclusion in a paper.
-   Search or analyse the entire internet or all academic publications.
-   Produce publication-ready academic writing.

------------------------------------------------------------------------

## 3. Target Users and Personas

### 3.1 Primary users

-   Undergraduate and postgraduate students beginning research.
-   Students preparing mini-projects, capstone projects, seminar
    presentations, or literature reviews.
-   Beginner researchers who need help comparing a small set of papers.

### 3.2 Secondary users

-   Research mentors who want a quick overview of a student's selected
    papers.
-   Student project teams exploring a technical topic.

### 3.3 User personas

**Persona A --- Beginner college student**

-   Has little experience reading research papers.
-   Finds academic language and long PDFs difficult.
-   Wants simple explanations and a clear starting point.
-   Needs: paper summaries, definitions, common themes, and guided
    navigation.

**Persona B --- Project-focused student**

-   Has selected a topic and collected several papers.
-   Wants to find a feasible project direction.
-   Needs: method comparison, limitations, possible gaps, and
    evidence-backed idea suggestions.

**Persona C --- Literature-review student**

-   Needs to compare papers and understand how the field has changed.
-   Needs: similarities, conflicting findings, recurring keywords, and
    publication-year trends.

------------------------------------------------------------------------

## 4. User Stories and Use Cases

### 4.1 User stories

  -----------------------------------------------------------------------
  ID                      User story              Priority
  ----------------------- ----------------------- -----------------------
  US-01                   As a student, I want to Must
                          upload multiple PDFs so 
                          I can analyse them      
                          together.               

  US-02                   As a beginner, I want a Must
                          simple explanation of   
                          each paper so I can     
                          understand it without   
                          reading every technical 
                          detail first.           

  US-03                   As a student, I want to Must
                          see common topics and   
                          methods across papers   
                          so I can understand     
                          their relationships.    

  US-04                   As a student, I want to Must
                          compare two or more     
                          papers so I can         
                          identify similarities   
                          and differences.        

  US-05                   As a student, I want to Must
                          see each paper's stated 
                          limitations so I can    
                          understand what its     
                          authors say remains     
                          unresolved.             

  US-06                   As a student, I want to Should
                          ask questions about my  
                          uploaded collection and 
                          receive source          
                          references.             

  US-07                   As a student, I want to Could
                          see a simple timeline   
                          of research topics by   
                          year.                   

  US-08                   As a project-focused    Should
                          student, I want         
                          possible project ideas  
                          based on recurring      
                          limitations so I can    
                          choose a direction to   
                          investigate.            

  US-09                   As a user, I want to    Must
                          open the source paper   
                          for an insight so I can 
                          verify it.              

  US-10                   As a user, I want clear Must
                          error messages when a   
                          PDF cannot be processed 
                          so I know what to do    
                          next.                   
  -----------------------------------------------------------------------

### 4.2 Main use case: Analyse a collection

1.  User opens SearchMate.
2.  User creates or opens a research workspace.
3.  User uploads 2--5 text-based research PDFs.
4.  System validates the files and extracts text.
5.  System extracts paper details and generates simple explanations.
6.  System identifies shared themes, methods, findings, and stated
    limitations.
7.  User views a collection overview.
8.  User opens a comparison, asks a question, or explores possible
    research directions.
9.  User checks the cited paper references before using an insight.

### 4.3 Additional use cases

-   **Understand one paper:** User opens a paper card and reads its
    objective, method, findings, and limitations in simple language.
-   **Compare papers:** User selects papers and views their methods,
    datasets, results, and limitations side by side.
-   **Explore a possible gap:** User views limitations repeated across
    multiple uploaded papers and the evidence supporting each one.
-   **Ask the collection:** User asks a question such as, "Which papers
    use deep learning, and what datasets do they mention?"
-   **Explore project directions:** User reviews suggested ideas, their
    rationale, and the papers that support them.

------------------------------------------------------------------------

## 5. Functional Requirements

Priority definitions:

-   **Must:** Required for a useful MVP.
-   **Should:** Important, but can be simplified or postponed if time is
    limited.
-   **Could:** Optional enhancement.
-   **Won't (MVP):** Explicitly excluded from the first release.

### 5.1 PDF upload and collection management

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-01                   Users can upload PDF    Must
                          research papers.        

  FR-02                   The MVP supports a      Must
                          maximum of 5 PDFs per   
                          collection.             

  FR-03                   The system validates    Must
                          file type and file size 
                          before processing.      

  FR-04                   The system displays     Must
                          upload and processing   
                          status for each file.   

  FR-05                   The system shows a      Must
                          useful error if a PDF   
                          is corrupt, encrypted,  
                          scanned without OCR     
                          support, or contains no 
                          extractable text.       

  FR-06                   Users can remove a      Should
                          paper from the current  
                          collection.             

  FR-07                   The application         Must
                          prevents unsupported    
                          files from entering the 
                          PDF-processing          
                          pipeline.               
  -----------------------------------------------------------------------

**Suggested MVP limits:** PDF only, maximum 10 MB per file, maximum 5
files per collection. These limits may be adjusted after testing.

### 5.2 Paper information extraction

For each uploaded paper, the system should attempt to extract:

-   Title
-   Authors
-   Publication year
-   Abstract
-   Keywords
-   Research problem or objective
-   Methodology
-   Dataset or data source, if stated
-   Main findings
-   Limitations and future work, if stated

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-08                   Extract text from       Must
                          supported PDFs.         

  FR-09                   Extract title,          Must
                          abstract, year, and key 
                          terms where available.  

  FR-10                   Generate a short,       Must
                          beginner-friendly       
                          explanation of the      
                          paper.                  

  FR-11                   Present objective,      Must
                          methodology, findings,  
                          and limitations in      
                          separate sections.      

  FR-12                   Mark fields as "Not     Must
                          found in paper" rather  
                          than inventing missing  
                          information.            

  FR-13                   Show the source paper   Must
                          for extracted           
                          information.            
  -----------------------------------------------------------------------

### 5.3 Research relationship explorer

The system should identify relationships using information extracted
from the uploaded papers.

Relationship types:

-   Shared research topic
-   Similar keywords or concepts
-   Similar methodology
-   Related datasets or problem settings
-   Similar or different findings

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-14                   Identify recurring      Must
                          themes across the       
                          collection.             

  FR-15                   Identify shared         Must
                          keywords or concepts    
                          between papers.         

  FR-16                   Identify methodology    Should
                          similarities where the  
                          paper text supports     
                          them.                   

  FR-17                   Display relationships   Must
                          in a simple, readable   
                          format.                 

  FR-18                   Let users open the      Must
                          papers behind a         
                          relationship.           
  -----------------------------------------------------------------------

**UX requirement:** Do not make a dense network graph the only way to
understand relationships. The MVP should prioritise readable paper
cards, grouped themes, and a simple connection view. If a graph is
included, use a small number of nodes, clear labels, and an explanation
panel.

### 5.4 Research gap and limitation detector

The detector must distinguish between:

-   **Author-stated limitation:** A limitation explicitly mentioned by a
    paper.
-   **Recurring limitation:** A similar limitation found in multiple
    uploaded papers.
-   **Potential research gap:** An area that appears underexplored
    within the uploaded collection and needs further verification.

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-19                   Extract limitations and Must
                          future-work statements  
                          from each paper.        

  FR-20                   Group similar           Should
                          limitations across      
                          papers.                 

  FR-21                   Highlight recurring     Should
                          limitations and show    
                          which papers mention    
                          them.                   

  FR-22                   Suggest potential       Should
                          research directions     
                          based on the evidence   
                          in the collection.      

  FR-23                   Clearly state that a    Must
                          collection-based gap is 
                          not proof that no prior 
                          research exists.        
  -----------------------------------------------------------------------

### 5.5 Contradiction and finding comparison

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-24                   Display the main        Must
                          findings of selected    
                          papers.                 

  FR-25                   Identify findings that  Should
                          appear different or     
                          conflicting.            

  FR-26                   Explain possible        Should
                          reasons for differences 
                          only when supported by  
                          paper details, such as  
                          different datasets,     
                          settings, or evaluation 
                          methods.                

  FR-27                   Label uncertain         Must
                          comparisons as "Needs   
                          manual verification."   
  -----------------------------------------------------------------------

The application must not treat different results as contradictions
automatically. Different datasets, metrics, experimental settings, or
research questions may explain the difference.

### 5.6 Research trend timeline

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-28                   Group extracted         Could
                          keywords or themes by   
                          publication year.       

  FR-29                   Display a simple        Could
                          year-wise timeline or   
                          chart.                  

  FR-30                   Avoid describing a      Must
                          topic as "declining" or 
                          "emerging" when the     
                          uploaded collection is  
                          too small to support    
                          that conclusion.        
  -----------------------------------------------------------------------

For the MVP, this feature may be a basic year-wise keyword view rather
than a sophisticated trend-prediction system.

### 5.7 Ask Your Research Collection

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-31                   Provide a question box  Should
                          for questions about     
                          uploaded papers.        

  FR-32                   Generate answers using  Must
                          only the uploaded       
                          collection as the       
                          evidence source.        

  FR-33                   Attach paper references Must
                          to factual answer       
                          claims.                 

  FR-34                   Show when the answer is Must
                          not available in the    
                          uploaded papers.        

  FR-35                   Allow users to open the Should
                          referenced paper or     
                          relevant extracted      
                          section.                
  -----------------------------------------------------------------------

Example questions:

-   "Which papers use machine learning?"
-   "What limitations are mentioned by more than one paper?"
-   "Which paper reports the highest accuracy, and what dataset did it
    use?"
-   "How do the methodologies of these two papers differ?"

If a metric is not directly comparable, the answer must explain why
instead of ranking the papers.

### 5.8 Research idea generator

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-36                   Suggest a small number  Should
                          of possible project     
                          directions based on     
                          extracted limitations   
                          and themes.             

  FR-37                   Explain the reasoning   Should
                          behind each suggestion. 

  FR-38                   Link each suggestion to Must
                          the papers that         
                          inspired it.            

  FR-39                   Label suggestions as    Must
                          ideas to investigate,   
                          not verified novel      
                          research contributions. 
  -----------------------------------------------------------------------

Each idea should contain:

-   Suggested title
-   Problem being explored
-   Why it may be worth investigating
-   Related limitations or themes
-   Supporting paper references
-   A simple first step for validation

### 5.9 Beginner-friendly interface

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-40                   Use plain language and  Must
                          explain technical terms 
                          when necessary.         

  FR-41                   Use a guided workflow:  Must
                          Upload → Understand →   
                          Explore → Discover.     

  FR-42                   Provide short           Must
                          explanations before     
                          showing complex         
                          comparisons or charts.  

  FR-43                   Use consistent labels,  Must
                          clear empty states, and 
                          helpful error messages. 

  FR-44                   Allow users to move     Must
                          from an insight to its  
                          supporting paper.       
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 6. Non-Functional Requirements

### 6.1 Usability and accessibility

-   The interface must be understandable to a first-time student user.
-   Use readable typography, sufficient contrast, clear headings, and
    consistent spacing.
-   Avoid unexplained technical terminology.
-   Ensure core workflows work on common laptop and mobile screen sizes.
-   Do not rely on colour alone to communicate status or relationship
    type.

### 6.2 Performance

-   Show progress while files are being processed.
-   Avoid blocking the entire interface during long-running analysis.
-   Process a small collection of up to 5 supported PDFs.
-   Display a clear timeout or retry message if extraction or AI
    processing fails.
-   Performance targets depend on PDF length, hosting, and AI-provider
    response times.

### 6.3 Reliability

-   Handle corrupt, encrypted, empty, and unsupported PDFs gracefully.
-   Preserve successfully processed papers if another paper fails.
-   Do not display partial AI output as a verified result.
-   Keep source references attached to generated insights.

### 6.4 Security and privacy

-   Validate uploaded file type, size, and content.
-   Store API keys only in server-side environment variables.
-   Do not expose secrets in frontend code or public repositories.
-   Restrict access to a user's collection if authentication is
    implemented.
-   Avoid collecting personal information that is not required.
-   Provide a way to delete uploaded papers and associated extracted
    data.
-   Do not use uploaded documents for model training unless the user has
    explicitly agreed and the chosen provider's terms permit it.
-   Treat PDF content as untrusted input. Instructions inside a paper
    must not override application or system instructions.
-   Apply safe error handling and avoid logging full paper contents or
    secrets.

### 6.5 AI output quality

-   Use uploaded papers as the evidence base for collection-specific
    answers.
-   Do not invent authors, publication years, datasets, metrics,
    limitations, or citations.
-   Mark missing or uncertain information clearly.
-   Include paper-level references for generated claims.
-   Separate author-stated facts from AI-generated interpretation.
-   Treat gap detection and idea generation as exploratory assistance,
    not proof of novelty.
-   Provide a "verify in source" path for important claims.

### 6.6 Maintainability

-   Keep PDF extraction, AI analysis, storage, and UI logic in separate
    modules.
-   Use reusable components for paper cards, citations, status messages,
    and comparison tables.
-   Keep prompts and output schemas in separate files or modules.
-   Handle API failures centrally.
-   Document environment variables and setup steps.

### 6.7 Cost constraints

-   Prefer free or low-cost development tools and services.
-   Limit the number and size of PDFs processed in the MVP.
-   Avoid repeatedly sending the full text of every paper for every user
    question.
-   Cache extracted paper metadata and analysis where practical.
-   Set request limits and handle AI-provider quota errors.
-   Make it clear if a third-party AI service has usage limits or may
    incur costs.

------------------------------------------------------------------------

## 7. MVP Scope and Out-of-Scope Features

### 7.1 Recommended MVP scope

The project is intended for an individual developer working within 1--2
weeks. Build a complete, reliable core workflow before attempting every
advanced feature.

**MVP --- Must build**

1.  Upload 2--5 text-based PDFs.
2.  Extract text and basic paper metadata.
3.  Generate a beginner-friendly paper explanation.
4.  Extract objective, methodology, findings, and stated limitations.
5.  Identify common themes and keywords across papers.
6.  Compare selected papers using a readable table or cards.
7.  Show source-paper references for generated insights.
8.  Provide clear upload, processing, success, and error states.

**MVP --- Build only if time permits**

-   Basic recurring-limitation grouping.
-   A simple question-answering interface over extracted paper content.
-   A small list of evidence-linked project directions.
-   A basic publication-year and keyword chart.

### 7.2 Out of scope for the first release

-   Searching the web or academic databases for papers.
-   Automatic access to paid research-paper repositories.
-   OCR for scanned PDFs.
-   Very large collections or unlimited uploads.
-   Real-time collaboration and shared workspaces.
-   User roles, teams, and advanced account management.
-   Citation-style generation and reference-manager integration.
-   Full interactive force-directed research graph.
-   Predicting future research trends.
-   Proving research novelty or guaranteeing that a gap has never been
    studied.
-   Automatic generation of a complete literature review or academic
    paper.
-   Advanced multilingual paper processing.

### 7.3 Suggested build order

  -----------------------------------------------------------------------
  Phase                   Deliverable             Priority
  ----------------------- ----------------------- -----------------------
  Phase 1                 Basic web UI, upload    Critical
                          validation, PDF text    
                          extraction              

  Phase 2                 Paper metadata and      Critical
                          simple explanations     

  Phase 3                 Theme extraction and    Critical
                          paper comparison        

  Phase 4                 Source references and   Critical
                          error handling          

  Phase 5                 Basic limitation        Stretch
                          grouping or collection  
                          Q&A                     

  Phase 6                 Idea suggestions and    Stretch
                          trend timeline          
  -----------------------------------------------------------------------

**Scope rule:** If the schedule becomes tight, finish upload,
extraction, understandable paper explanations, comparison, and source
references. A smaller working product is better than several unreliable
AI features.

------------------------------------------------------------------------

## 8. Acceptance Criteria

The MVP is accepted when the following conditions are met.

### 8.1 Upload and extraction

-   [ ] A user can upload at least 2 supported research PDFs.
-   [ ] The application rejects non-PDF files and files above the
    configured size limit.
-   [ ] Each file displays its processing status.
-   [ ] Extracted text is available for supported PDFs.
-   [ ] A failed file displays a useful error without crashing the
    collection.

### 8.2 Paper understanding

-   [ ] Each successfully processed paper has a paper detail view.
-   [ ] The view shows available title, year, abstract, objective,
    method, findings, and limitations.
-   [ ] The system marks unavailable fields as "Not found in paper."
-   [ ] The explanation is written in beginner-friendly language.
-   [ ] The user can identify which paper an explanation belongs to.

### 8.3 Relationships and comparison

-   [ ] The system identifies at least one shared theme when one exists
    in the test collection.
-   [ ] The user can compare at least two papers.
-   [ ] Similarities and differences are presented in readable text or a
    table.
-   [ ] Each relationship can be traced to the papers supporting it.
-   [ ] The interface does not rely on a complex graph as the only
    explanation.

### 8.4 Gaps and ideas

-   [ ] The application distinguishes author-stated limitations from
    potential gaps.
-   [ ] A recurring limitation shows the papers in which it appears.
-   [ ] Potential gaps are labelled as requiring further literature
    review.
-   [ ] Suggested project directions include a rationale and supporting
    paper references.

### 8.5 Collection Q&A

-   [ ] A user can submit a question about the uploaded collection.
-   [ ] The answer uses the uploaded papers as its evidence source.
-   [ ] Factual claims include paper references.
-   [ ] The application says when the collection does not contain enough
    information to answer.
-   [ ] The system does not invent a paper citation.

### 8.6 Overall usability and safety

-   [ ] A first-time user can complete the core workflow without
    developer assistance.
-   [ ] Important actions have visible feedback.
-   [ ] The application works on a common desktop browser.
-   [ ] API keys are not exposed in client-side code.
-   [ ] Users can remove uploaded papers and associated data, or the
    prototype clearly explains its temporary-storage behaviour.
-   [ ] The application displays a clear disclaimer that AI-generated
    analysis may be incomplete and should be verified against original
    papers.

------------------------------------------------------------------------

## 9. Risks, Assumptions, and Constraints

### 9.1 Risks

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  PDF text extraction is  AI analysis may miss    Support text-based PDFs
  incomplete              important sections      first; show extraction
                                                  warnings; test with
                                                  varied PDFs

  Academic layouts        Title, abstract, or     Use section-aware
  confuse extraction      sections may be         parsing where possible
                          misidentified           and allow users to
                                                  inspect extracted text

  AI generates            Students may trust      Require source
  unsupported claims      incorrect insights      references, mark
                                                  uncertainty, and show
                                                  "Not found" when
                                                  evidence is absent

  Similar terms are       Incorrect paper         Use conservative theme
  treated as identical    relationships           grouping and show why
                                                  papers were connected

  Different results are   Misleading comparisons  Compare research
  labelled contradictions                         question, dataset,
                                                  metric, and
                                                  experimental setup
                                                  before labelling a
                                                  conflict

  A potential gap is      User may assume the     Use "potential gap in
  presented as a proven   topic is novel          this collection"
  gap                                             language and require
                                                  external verification

  AI API costs or rate    Analysis may stop       Limit PDFs and text
  limits                  working                 length, cache results,
                                                  and handle quota errors

  Processing takes too    Users may leave before  Show progress and
  long                    results appear          process papers one at a
                                                  time or in controlled
                                                  batches

  Scanned PDFs cannot be  Upload appears broken   Clearly state that the
  read                                            MVP supports text-based
                                                  PDFs only

  Scope becomes too large MVP is unfinished       Prioritise core
                                                  workflow and keep
                                                  advanced features
                                                  optional
  -----------------------------------------------------------------------

### 9.2 Assumptions

-   Users have access to research papers in PDF format.
-   The first release primarily supports English-language, text-based
    PDFs.
-   Users upload a small collection of approximately 2--5 papers.
-   Users have a stable internet connection when AI processing is
    required.
-   An AI model or API is available during development and
    demonstration.
-   The MVP is an educational support tool, not a replacement for
    academic judgement.
-   The developer can test with a small collection of sample papers.

### 9.3 Constraints

-   Individual development.
-   Target implementation period: 1--2 weeks.
-   Intermediate-level AI/ML and web-development skills.
-   Limited budget; avoid paid infrastructure where possible.
-   AI-provider rate limits, context limits, and service availability
    may affect performance.
-   PDF extraction quality depends on the structure and quality of
    uploaded files.
-   The system can identify patterns only within the papers uploaded by
    the user.

### 9.4 Key product safeguards

SearchMate must consistently use careful language:

-   Say **"mentioned limitation"** when the authors explicitly state it.
-   Say **"recurring limitation in your collection"** when it appears in
    multiple uploaded papers.
-   Say **"potential research gap"** when the system infers an
    underexplored area from the collection.
-   Never say **"no one has researched this"** based only on uploaded
    papers.
-   Say **"different findings"** before calling results contradictory.
-   Show the source papers so users can verify the interpretation.

------------------------------------------------------------------------

## 10. Suggested MVP Screens

1.  **Landing page**
    -   Short product explanation.
    -   "Start analysing" action.
    -   Simple 3-step description: Upload, Understand, Discover.
2.  **Upload workspace**
    -   Drag-and-drop PDF area.
    -   File list, size information, remove action, and processing
        status.
    -   Supported-file guidance.
3.  **Collection overview**
    -   Number of papers analysed.
    -   Common themes and keywords.
    -   Short collection-level explanation.
    -   Links to paper details and comparisons.
4.  **Paper detail**
    -   Paper title and available metadata.
    -   Simple explanation.
    -   Objective, methodology, findings, limitations.
    -   Source text or page reference where available.
5.  **Compare papers**
    -   Paper selector.
    -   Comparison table for objective, methods, dataset, findings, and
        limitations.
    -   Clear labels for missing or non-comparable information.
6.  **Discover**
    -   Recurring limitations and potential gaps.
    -   Optional project directions with evidence references.
    -   Clear note that suggestions require further validation.
7.  **Ask the collection** *(stretch feature)*
    -   Question input.
    -   Answer area with paper references.
    -   "Not found in uploaded papers" response when appropriate.

------------------------------------------------------------------------

## 11. Definition of Done

The SearchMate MVP is ready for college evaluation when:

-   The core upload-to-analysis workflow works from start to finish.
-   At least two papers can be analysed together.
-   Paper explanations are understandable to a beginner.
-   At least one useful cross-paper comparison is demonstrated.
-   Generated insights show their supporting papers.
-   Failure cases are handled without crashing the application.
-   The interface is clean and understandable.
-   The project README explains setup, limitations, and how to run the
    application.
-   The demo clearly distinguishes implemented features from planned
    enhancements.

**Product principle:** SearchMate should make research feel clearer, not
make the interface another research paper. Every graph, comparison, and
AI-generated insight must answer a simple question: *What does this
mean, and which paper supports it?*

## Feature coverage update --- interactive graph and underexplored-topic detection

This update supplements the existing functional requirements above. It
does not duplicate requirements already covered in Sections 5.1--5.8.

### Additional requirements

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-45                   Identify topics or      Should
                          themes that recur       
                          across multiple         
                          uploaded papers but     
                          receive limited depth,  
                          evidence, evaluation,   
                          or follow-up within the 
                          collection. Show the    
                          papers and passages     
                          supporting both the     
                          recurrence and the      
                          apparent lack of        
                          exploration.            

  FR-46                   Provide an interactive  Could / post-MVP
                          research relationship   
                          graph as an alternate   
                          exploration view, with  
                          paper and theme nodes,  
                          labelled connections,   
                          and a details panel.    
                          Selecting a node or     
                          connection must reveal  
                          the supporting papers   
                          and evidence            
                          references.             

  FR-47                   Allow users to inspect  Should
                          apparently conflicting  
                          findings side by side   
                          and present             
                          evidence-supported      
                          explanations for the    
                          differences. The system 
                          may clarify or          
                          contextualise a         
                          conflict; it must not   
                          claim to scientifically 
                          resolve it unless the   
                          papers provide          
                          sufficient evidence.    
  -----------------------------------------------------------------------

### Graph behaviour and constraints

-   Keep the readable paper cards, grouped themes, and comparison view
    available; the graph is an additional way to explore, not the only
    interface.
-   Use a small, understandable graph for collections of up to five
    papers. Avoid implying a relationship solely from visual proximity.
-   Label each edge with its relationship type (for example, shared
    topic, keyword overlap, similar method, or differing finding) and
    provide a short explanation.
-   Provide keyboard-accessible selection and a non-graph list/table
    alternative.

### Underexplored-topic interpretation

A topic may be flagged as repeatedly mentioned but insufficiently
explored only when the collection contains evidence of repeated mentions
and a separately stated basis for limited exploration (for example, a
limitation, a narrow dataset, an unanswered question, or an
author-stated future-work item). Show this as a **potential
underexplored topic in this collection**, not as a claim about the
entire research field.

### Product differentiation / USP

SearchMate's intended differentiator is the integrated,
beginner-friendly workflow that connects multi-paper understanding,
methodology/finding comparison, evidence-linked relationship
exploration, recurring limitation and potential-gap discovery, year-wise
topic inspection, grounded Q&A, and evidence-derived project directions
in one workspace. Treat this as the product's intended USP, not as a
verified claim that no other product offers these capabilities.

------------------------------------------------------------------------

## Product Scope Addendum --- Interactive Research Graph (2026-11-22)

This addendum supersedes earlier wording that treated the basic
interactive graph as post-MVP. The **Essential graph capabilities are
now part of the MVP**. Advanced graph capabilities remain post-MVP.

### Priority definition

  -----------------------------------------------------------------------
  Priority                Features                Release
  ----------------------- ----------------------- -----------------------
  Essential               Paper and theme nodes;  MVP
                          labelled relationship   
                          lines; click-to-view    
                          details; evidence       
                          references; zoom and    
                          pan; search; core       
                          filters; reset          

  Advanced                Research-gap nodes;     Post-MVP
                          conflicting-finding     
                          nodes/links;            
                          publication-year graph  
                          filters; custom         
                          layouts;                
                          relationship-strength   
                          visualization           
  -----------------------------------------------------------------------

### Essential functional requirements

**FR-GRAPH-01 --- Paper and theme nodes** - Render one node for each
included paper and each supported recurring theme in the selected
collection. - Paper nodes should show a concise title (truncated
visually where needed) and expose full title, authors, and year in the
details panel. - Theme nodes should show the theme label and the number
of linked papers when that count is available. - Every node must have a
stable identifier and a node type (`paper` or `theme`). - Do not create
nodes for unsupported or unverified concepts.

**FR-GRAPH-02 --- Typed relationship lines** - Connect papers to themes
using validated paper-theme relationships. - Where the existing
relationship analysis supports it, show paper-to-paper links for shared
themes or keywords. - Each edge must have a relationship type and a
short human-readable label or explanation. - Visual proximity alone must
never imply a relationship. - Do not display a relationship if its
source records cannot be resolved.

**FR-GRAPH-03 --- Click-to-view details** - Selecting a paper node opens
a details panel containing available title, authors, year,
abstract/summary, keywords, methodology, findings, and limitations. -
Selecting a theme node opens its description, related papers, shared
keywords, and available evidence. - Selecting an edge opens the
relationship type, explanation, connected records, and supporting
evidence. - Missing fields must be labelled "Not found in paper" or
omitted; do not fabricate metadata.

**FR-GRAPH-04 --- Evidence references** - Each displayed edge must link
to one or more supporting paper/evidence records. - Show paper title and
page number where available; provide a route to the relevant paper
detail or evidence excerpt. - If the relationship is inferred from a
similarity score rather than a directly stated author claim, label it as
an analytical similarity, not as a fact stated by the authors. -
Evidence references must be validated against the current collection
before display.

**FR-GRAPH-05 --- Navigation controls** - Provide zoom in, zoom out,
pan/drag, and reset-to-fit controls. - Controls must also be usable
without a mouse where technically feasible. - Reset restores the default
graph viewport and clears transient node/edge selection. It must not
silently delete saved research data.

**FR-GRAPH-06 --- Search** - Search paper titles, theme labels, and
available keywords. - Show matching nodes and make it possible to focus
the graph on a selected result. - Provide a clear empty state when no
match exists.

**FR-GRAPH-07 --- Essential filters** - Filter by node type
(papers/themes) and relationship type. - Make active filters visible and
provide a clear-all action. - Filtering changes only the graph view; it
must not modify the underlying collection or analysis records.

### Advanced post-MVP requirements

-   **Research-gap nodes:** display potential gaps derived from repeated
    limitations or sparse coverage in the uploaded collection. Link each
    gap to the supporting papers and limitations. Label these as
    collection-based hypotheses, not proof of global novelty.
-   **Conflicting-finding relationships:** connect papers whose reported
    findings differ. Display the compared claims, relevant context (such
    as dataset, population, method, or conditions when available), and
    evidence. Do not automatically call every difference a
    contradiction.
-   **Publication-year filters:** allow filtering paper nodes and
    connected relationships by year. Unknown years must be represented
    as unknown, not guessed.
-   **Custom layouts:** consider force-directed, hierarchical, and
    circular layouts. Preserve the same node/edge data and selection
    semantics when switching layouts.
-   **Relationship-strength visualization:** encode a documented
    similarity or evidence-strength measure through line thickness or
    another redundant visual cue. Show the measure and its meaning in
    the details panel; do not imply statistical confidence unless it has
    actually been calculated.

### Graph acceptance criteria

-   A collection with valid paper/theme relationships renders the
    correct paper and theme nodes.
-   Every edge has a valid source, target, type, and at least one
    resolvable evidence reference.
-   Selecting each node and edge opens the correct details and evidence.
-   Search, node-type filters, relationship-type filters, zoom, pan, and
    reset work without changing stored analysis.
-   Empty, partial, and failed graph states are understandable and
    recoverable.
-   Keyboard users have an accessible way to inspect nodes and
    relationships, and a list/table alternative provides equivalent core
    information.
-   The graph does not imply unsupported relationships through
    proximity, colour, line thickness, or layout.
-   Advanced features are not required for MVP acceptance.

### Non-functional and scope constraints

-   The MVP graph is bounded to the product's small collection size (up
    to five PDFs) and must remain readable rather than maximising node
    count.
-   Reuse the existing modular-monolith backend, relationship-analysis
    output, API conventions, and SQLite records.
-   Represent graph responses as validated JSON nodes and edges. Do not
    add a graph database, microservice, distributed queue, or separate
    analysis pipeline for this feature.
-   Select a React-compatible visualization library only after checking
    licence, maintenance, bundle size, keyboard accessibility, and
    reduced-motion support.
-   Keep the graph optional as a view: paper cards, grouped themes, and
    comparison tables remain available.
