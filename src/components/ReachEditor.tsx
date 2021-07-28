import React, {SyntheticEvent, useRef} from 'react'
import {
  Editor,
  DraftHandleValue,
  RichUtils,
  getDefaultKeyBinding,
  EditorState,
  ContentBlock,
  DraftBlockType
} from 'draft-js'

type RichEditorPropsType = {
  formikOnChange?: Function,
  editorState: EditorState,
  onBlur?: Function,
  readOnly?: boolean
}

type SyntheticKeyboardEvent = React.KeyboardEvent<{}>

export const RichEditor = ({ formikOnChange, editorState, readOnly }: RichEditorPropsType) => {
  let lastEvent: SyntheticKeyboardEvent
  const editorRef = useRef<any>(null)

  function focus () {
    return editorRef?.current?.focus()
  }

  function onChange (editorState: EditorState) {
    formikOnChange && formikOnChange('editorState', editorState)
  }

  function myKeyBindingFn(e: SyntheticKeyboardEvent): string | null {
    lastEvent = e

    if (e.code === 'Tab') {
      return 'tab-pressed';
    }

    return getDefaultKeyBinding(e);
  }

  function handleKeyCommand (command: string): DraftHandleValue {
    if (command === 'tab-pressed') {
      const maxDepth = 4

      const newState = RichUtils.onTab(lastEvent, editorState, maxDepth)

      onChange(newState)
      return 'handled'
    }
    return 'not-handled';
  }

  function toggleBlockType (blockType: DraftBlockType) {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }

  function toggleInlineStyle (inlineStyle: string) {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  let className = 'RichEditor-editor';

  const contentState = editorState.getCurrentContent();

  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  if (readOnly) {
    return <Editor readOnly={readOnly} editorState={editorState} onChange={onChange} />
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={className} onClick={focus}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
          onChange={onChange}
          ref={editorRef}
          spellCheck={true}
        />
      </div>
    </div>
  )
}

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle(block: ContentBlock) {
  const type = block.getType()

  if (type === 'blockquote') {
    return 'RichEditor-blockquote'
  }

  return ''
}

function StyleButton ({ onToggle, style, active, label }: any) {
  let className = 'RichEditor-styleButton';

  function onToggleHandler (e: SyntheticEvent) {
    e.preventDefault()

    onToggle(style);
  }

  if (active) {
    className += ' RichEditor-activeButton'
  }

  return <span className={className} onMouseDown={onToggleHandler}>{label}</span>
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]

const BlockStyleControls = ({ editorState, onToggle }: any) => {

  const selection = editorState.getSelection()

  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props: any) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
