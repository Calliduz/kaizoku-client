import type { Character } from '../types';
import '../styles/components/CharacterList.css';

interface CharacterListProps {
  characters: Character[];
}

export default function CharacterList({ characters }: CharacterListProps) {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="character-list">
      <h3 className="character-list__title">Characters & Cast</h3>
      <div className="character-list__grid">
        {characters.map((char) => {
          const mainVA = char.voiceActors && char.voiceActors[0];
          
          return (
            <div key={char.id} className="char-card glass">
              <div className="char-card__char">
                <img src={char.image} alt={char.name} className="char-card__image" />
                <div className="char-card__info">
                  <span className="char-card__name">{char.name}</span>
                  <span className="char-card__role">{char.role.toLowerCase()}</span>
                </div>
              </div>
              
              {mainVA && (
                <div className="char-card__va">
                  <div className="char-card__info char-card__info--va">
                    <span className="char-card__name">{mainVA.name}</span>
                    <span className="char-card__role">japanese</span>
                  </div>
                  <img src={mainVA.image} alt={mainVA.name} className="char-card__image" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
