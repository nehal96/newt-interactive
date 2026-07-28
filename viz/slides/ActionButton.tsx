import { Button } from "@ui/controls";

const ActionButton = ({ children, onClick }) => {
  return (
    <Button
      variant="primary"
      className="w-1/2 self-center mb-4"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
