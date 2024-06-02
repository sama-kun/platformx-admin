import dynamic from 'next/dynamic';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditEditorComponentProps<T extends FieldValues> extends UseControllerProps<T> {
  config?: any;
  disabled?: boolean;
}

const JoditEditorUI = <T extends FieldValues>(props: JoditEditorComponentProps<T>) => {
  const {
    field: { onChange, value },
  } = useController(props);

  return (
    <JoditEditor
      value={value}
      config={{ readonly: props.disabled, ...props.config }}
      onBlur={newContent => onChange(newContent)}
    />
  );
};

export default JoditEditorUI;
