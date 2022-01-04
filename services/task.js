export const mapTasks = data => {
  if (!data) return [];

  const { rows } = data;
  return (rows && rows.map(row => ({ ...row.task }))) || [];
};