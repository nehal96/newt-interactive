interface LabelNodeProps {
  data: {
    label: string;
  };
}

const LabelNode = ({ data }: LabelNodeProps) => {
  return <div className="px-2 py-1 text-sm text-slate-600">{data.label}</div>;
};

export default LabelNode;
