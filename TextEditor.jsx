import { useLoad } from './useLoad';
import { useSave } from './useSave';

function TextEditor() {
  const { content, setContent, isLoading } = useLoad();
  const { debouncedSave } = useSave(content);

  const handleChange = (e) => {
    setContent(e.target.value);
    debouncedSave();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Start typing..."
      style={{
        width: '100%',
        height: '100vh',
        padding: '18px',
        border: 'none',
        outline: 'none',
        fontSize: '18px',
        fontFamily: 'system-ui',
        lineHeight: '1.5',
        resize: 'none'
      }}
    />
  );
}

export default TextEditor;