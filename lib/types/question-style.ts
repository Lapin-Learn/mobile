type QuestionCardDecoration = {
  isScrollable: boolean;
};

type LayoutDecoration = {
  position: 'top' | 'center';
};

type MultipleChoiceDecoration = {
  choice: 'radio' | 'button' | 'checkbox';
};

export { LayoutDecoration, MultipleChoiceDecoration, QuestionCardDecoration };
