// JoditEditorComponent.tsx
import dynamic from 'next/dynamic';
import { useController, UseControllerProps } from 'react-hook-form';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditEditorComponentProps extends UseControllerProps {
  config?: any;
}

const JoditEditorUI: React.FC<JoditEditorComponentProps> = (props) => {
  const {
    field: { onChange, value },
  } = useController(props);

  return (
    <JoditEditor
      value={value}
      config={{ readonly: false, ...props.config }}
      onBlur={newContent => onChange(newContent)}
    />
  );
};

export default JoditEditorUI;