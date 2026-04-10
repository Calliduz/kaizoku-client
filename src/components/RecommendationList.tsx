import { Link } from 'react-router-dom';
import type { Recommendation, Relation } from '../types';
import '../styles/components/RecommendationList.css';

interface RecommendationListProps {
  title: string;
  items: (Recommendation | Relation)[];
}

export default function RecommendationList({ title, items }: RecommendationListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rec-list">
      <h3 className="rec-list__title">{title}</h3>
      <div className="rec-list__scroll">
        {items.map((item, index) => {
          // A relation has relationType, a recommendation has averageScore
          const relationType = (item as Relation).relationType;
          
          return (
            <Link 
              key={`${item.id}-${index}`} 
              to={`/?search=${encodeURIComponent(item.title)}`} 
              className="rec-item glass"
            >
              <div className="rec-item__image-wrap">
                <img src={item.coverImage} alt={item.title} className="rec-item__image" />
                {relationType && (
                  <span className="rec-item__badge">{relationType.replace(/_/g, ' ')}</span>
                )}
              </div>
              <div className="rec-item__info">
                <h4 className="rec-item__title">{item.title}</h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
