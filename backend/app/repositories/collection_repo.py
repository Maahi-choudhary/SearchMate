from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Collection

class CollectionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str) -> Collection:
        collection = Collection(name=name)
        self.db.add(collection)
        self.db.commit()
        self.db.refresh(collection)
        return collection

    def get_by_id(self, collection_id: str) -> Optional[Collection]:
        return self.db.query(Collection).filter(Collection.id == collection_id).first()

    def list_all(self) -> List[Collection]:
        return self.db.query(Collection).order_by(Collection.created_at.desc()).all()

    def delete(self, collection_id: str) -> bool:
        collection = self.get_by_id(collection_id)
        if collection:
            self.db.delete(collection)
            self.db.commit()
            return True
        return False
