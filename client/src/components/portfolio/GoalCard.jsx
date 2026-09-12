import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { Edit, Trash2 } from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'not-started': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{goal.title}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="primary">{goal.category}</Badge>
        <Badge variant={getStatusColor(goal.status)}>{goal.status}</Badge>
      </div>
      <p className="text-gray-600 text-sm mt-3 flex-grow">{goal.notes || 'No additional notes.'}</p>
      <div className="mt-4">
        <p className="text-gray-700 text-sm mb-1">Progress: {goal.progressPercent}%</p>
        <ProgressBar progress={goal.progressPercent} color={getStatusColor(goal.status)} />
      </div>
      <p className="text-gray-400 text-xs mt-3">Target Date: {goal.targetDate ? formatDate(goal.targetDate) : 'N/A'}</p>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={() => onEdit(goal._id)} title="Edit Goal">
            <Edit size={18} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(goal._id)} title="Delete Goal">
            <Trash2 size={18} />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;