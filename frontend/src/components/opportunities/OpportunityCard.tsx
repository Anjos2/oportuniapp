import { Link } from 'react-router-dom';
import { MapPin, Calendar, Bookmark, BookmarkCheck, Clock, Users } from 'lucide-react';
import { Opportunity } from '../../types';
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: number) => void;
  onUnsave?: (id: number) => void;
  isSaved?: boolean;
  showActions?: boolean;
}

const typeColors: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  cyan: 'bg-cyan-100 text-cyan-800',
};

const modalityLabels: Record<string, string> = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  hibrido: 'Híbrido',
};

export default function OpportunityCard({
  opportunity,
  onSave,
  onUnsave,
  isSaved = false,
  showActions = true,
}: OpportunityCardProps) {
  const deadlinePassed = opportunity.application_deadline
    ? isPast(new Date(opportunity.application_deadline))
    : false;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved && onUnsave) {
      onUnsave(opportunity.id);
    } else if (onSave) {
      onSave(opportunity.id);
    }
  };

  return (
    <Link to={`/opportunities/${opportunity.id}`}>
      <div className="card-hover h-full flex flex-col">
        {/* Image/Header */}
        <div className="relative h-40 bg-gradient-to-br from-primary-800 to-primary-600">
          {opportunity.image_url ? (
            <img
              src={opportunity.image_url}
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-white/20">
                {opportunity.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Featured badge */}
          {opportunity.is_featured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
              Destacada
            </div>
          )}

          {/* Save button */}
          {showActions && (
            <button
              onClick={handleSaveClick}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary-800" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Type badge */}
          <div className="absolute bottom-3 left-3">
            <span
              className={clsx(
                'badge',
                typeColors[opportunity.type_color || 'blue']
              )}
            >
              {opportunity.type_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {opportunity.title}
          </h3>

          {opportunity.organization_name && (
            <p className="text-sm text-gray-600 mb-2">
              {opportunity.organization_name}
            </p>
          )}

          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
            {opportunity.description}
          </p>

          {/* Meta info */}
          <div className="space-y-2 text-sm text-gray-500">
            {opportunity.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{opportunity.location}</span>
              </div>
            )}

            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{modalityLabels[opportunity.modality]}</span>
            </div>

            {opportunity.application_deadline && (
              <div className={clsx('flex items-center', deadlinePassed && 'text-red-500')}>
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  {deadlinePassed ? 'Cerrado' : `Hasta ${format(new Date(opportunity.application_deadline), 'dd MMM yyyy', { locale: es })}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {opportunity.applications_count || 0} postulantes
          </span>
          <span>
            {format(new Date(opportunity.created_at), 'dd MMM', { locale: es })}
          </span>
        </div>
      </div>
    </Link>
  );
}
