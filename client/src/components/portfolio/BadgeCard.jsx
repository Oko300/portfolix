import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CheckCircle, Award, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const BadgeCard = ({ badge, onVerify, onDelete, showActions = true, isTeacher = false }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex-shrink-0 relative h-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {badge.imageUrl ? (
          <img src={badge.imageUrl} alt={badge.title} className="w-full h-full object-cover" />
        ) : (
          <Award size={60} className="text-gray-400" />
        )}
      </div>
      <div className="flex-grow mt-4">
        <h4 className="text-lg font-bold text-gray-800 line-clamp-2">{badge.title}</h4>
        <p className="text-gray-600 text-sm mt-1">Issuer: {badge.issuer || 'N/A'}</p>
        <p className="text-gray-600 text-sm">Issued: {badge.issueDate ? formatDate(badge.issueDate) : 'N/A'}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{badge.description}</p>
        <div className="mt-3">
          {badge.isVerified ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle size={14} /> Verified
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1">
              Unverified
            </Badge>
          )}
        </div>
      </div>
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-end">
          {isTeacher && !badge.isVerified && (
            <Button variant="primary" size="sm" onClick={() => onVerify(badge._id)} title="Verify Badge">
              <CheckCircle size={18} /> Verify
            </Button>
          )}
          {!isTeacher && (
            <Button variant="danger" size="sm" onClick={() => onDelete(badge._id)} title="Delete Badge">
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default BadgeCard;