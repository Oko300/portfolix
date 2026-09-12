import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { Edit } from 'lucide-react';

const ReflectionCard = ({ reflection, workTitle, onEdit }) => {
  return (
    <Card className="flex flex-col">
      <h3 className="text-xl font-bold text-gray-800">Reflection on: <span className="text-primary">{workTitle}</span></h3>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700">What I Learned:</h4>
        <p className="text-gray-600 mt-1">{reflection.whatILearned}</p>
      </div>
      <div className="mt-3">
        <h4 className="font-semibold text-gray-700">What I'd Do Differently:</h4>
        <p className="text-gray-600 mt-1">{reflection.whatIdDoDifferently || 'N/A'}</p>
      </div>
      {reflection.skillsDemonstrated && reflection.skillsDemonstrated.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-gray-700">Skills Demonstrated:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {reflection.skillsDemonstrated.map((skill, index) => (
              <Badge key={index} variant="default">{skill}</Badge>
            ))}
          </div>
        </div>
      )}
      <p className="text-gray-400 text-xs mt-4">Reflected: {formatDate(reflection.createdAt)}</p>
      {onEdit && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => onEdit(reflection._id)} title="Edit Reflection">
            <Edit size={18} /> Edit Reflection
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ReflectionCard;