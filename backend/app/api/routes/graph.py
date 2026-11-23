from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories import CollectionRepository, PaperRepository
from app.schemas.common import APIResponse, ErrorCodes
from app.schemas.graph import GraphResponse
from app.services.relationship_service import RelationshipService

router = APIRouter()

@router.get("/collections/{collection_id}/graph", response_model=APIResponse[GraphResponse])
def get_collection_graph(collection_id: str, db: Session = Depends(get_db)):
    col_repo = CollectionRepository(db)
    col = col_repo.get_by_id(collection_id)
    if not col:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCodes.RESOURCE_NOT_FOUND, "message": "Collection not found"}
        )

    paper_repo = PaperRepository(db)
    papers = paper_repo.get_by_collection(collection_id)

    graph_data = RelationshipService.build_essential_graph(
        collection_id=collection_id,
        papers=papers,
        themes=col.themes
    )

    return APIResponse(
        success=True,
        data=GraphResponse(**graph_data),
        message="Collection relationship graph generated"
    )
