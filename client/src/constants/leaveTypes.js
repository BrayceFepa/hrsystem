// Exact leave types from the backend model
export const LEAVE_TYPES = {
  SICK_LEAVE_WITH_DOC: 'Sick Leave with document',
  SICK_LEAVE_WITHOUT_DOC: 'Sick Leave without document',
  REMOTE_WORK: 'Remote Work',
  ANNUAL_LEAVE: 'Annual Leave',
  BEREAVEMENT_LEAVE: 'Bereavement Leave',
  UNEXCUSED_ABSENCE: 'Unexcused Absence',
  BUSINESS_LEAVE: 'Business Leave'
};

// For dropdown/select options
export const LEAVE_TYPE_OPTIONS = [
  { value: LEAVE_TYPES.SICK_LEAVE_WITH_DOC, label: 'Sick Leave (with document)' },
  { value: LEAVE_TYPES.SICK_LEAVE_WITHOUT_DOC, label: 'Sick Leave (without document)' },
  { value: LEAVE_TYPES.REMOTE_WORK, label: 'Remote Work' },
  { value: LEAVE_TYPES.ANNUAL_LEAVE, label: 'Annual Leave' },
  { value: LEAVE_TYPES.BEREAVEMENT_LEAVE, label: 'Bereavement Leave' },
  { value: LEAVE_TYPES.UNEXCUSED_ABSENCE, label: 'Unexcused Absence' },
  { value: LEAVE_TYPES.BUSINESS_LEAVE, label: 'Business Leave' }
];

// Helper to get display label from type value
export const getLeaveTypeLabel = (type) => {
  const option = LEAVE_TYPE_OPTIONS.find(opt => opt.value === type);
  return option ? option.label : type;
};

// Map from legacy type values to new type values
export const mapLegacyType = (type) => {
  const legacyMap = {
    'sick_with_document': LEAVE_TYPES.SICK_LEAVE_WITH_DOC,
    'sick_home': LEAVE_TYPES.SICK_LEAVE_WITHOUT_DOC,
    'remote_work': LEAVE_TYPES.REMOTE_WORK,
    'annual_leave': LEAVE_TYPES.ANNUAL_LEAVE,
    'bereavement': LEAVE_TYPES.BEREAVEMENT_LEAVE,
    'unexcused_absence': LEAVE_TYPES.UNEXCUSED_ABSENCE,
    'business_leave': LEAVE_TYPES.BUSINESS_LEAVE
  };
  return legacyMap[type] || type;
};