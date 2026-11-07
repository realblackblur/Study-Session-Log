interface SessionFormProps {
  subjectName: string;
  errorMessage: string;
  onSubjectChange: (value: string) => void;
  onSave: () => void;
}

function SessionForm({
  subjectName,
  errorMessage,
  onSubjectChange,
  onSave,
}: SessionFormProps) {
  return (
    <>
      <div>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Subject Name"
        />
        <button onClick={onSave}>Save</button>
      </div>
      {errorMessage !== "" && <p>{errorMessage}</p>}
    </>
  );
}

export default SessionForm;
