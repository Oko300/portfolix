import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { getFileTypeIcon, formatDate } from '../../utils/helpers';
import { Edit, Trash2, Eye } from 'lucide-react';

const WorkCard = ({ work, onEdit, onDelete, onViewReflection, showActions = true }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex-shrink-0 relative h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {work.thumbnailUrl ? (
          <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
        ) : work.fileUrl && work.fileType.startsWith('image') ? (
          <img src={work.fileUrl} alt={work.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl text-gray-400">{getFileTypeIcon(work.fileType)}</span>
        )}
      </div>
      <div className="flex-grow mt-4">
        <h4 className="text-lg font-bold text-gray-800 line-clamp-2">{work.title}</h4>
        <p className="text-gray-600 text-sm mt-1 line-clamp-3">{work.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="primary">{work.category}</Badge>
          {work.tags && work.tags.map((tag, index) => (
            <Badge key={index} variant="default">{tag}</Badge>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-2">Uploaded: {formatDate(work.createdAt)}</p>
      </div>
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => onViewReflection(work._id)} title="View/Add Reflection">
            <Eye size={18} />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onEdit(work._id)} title="Edit Work">
            <Edit size={18} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(work._id)} title="Delete Work">
            <Trash2 size={18} />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default WorkCard;