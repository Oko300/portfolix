import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const FeedbackItem = ({ feedback, onDelete, showActions = true, currentUserId, isAdmin }) => {
  const isAuthor = currentUserId === feedback.authorId._id;
  const canDelete = isAuthor || isAdmin;

  return (
    <Card className="!p-4 border-l-4 border-primary/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-800 font-semibold">{feedback.authorId.name} <span className="text-gray-500 text-sm">({feedback.authorId.role})</span></p>
          {feedback.workId && <p className="text-gray-500 text-sm">Regarding: {feedback.workId.title}</p>}
          <p className="text-gray-700 mt-2">{feedback.message}</p>
          <p className="text-gray-400 text-xs mt-2">{formatDate(feedback.createdAt)}</p>
        </div>
        {showActions && canDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(feedback._id)} title="Delete Feedback">
            <Trash2 size={18} />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FeedbackItem;