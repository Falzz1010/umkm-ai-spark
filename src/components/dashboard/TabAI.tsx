
import { EnhancedAIAssistant } from './EnhancedAIAssistant';

interface TabAIProps {
  products: any[];
  onGenerationComplete: () => void;
}

export function TabAI({ products, onGenerationComplete }: TabAIProps) {
  return (
    <div className="w-full max-w-full">
      <EnhancedAIAssistant products={products} onGenerationComplete={onGenerationComplete} />
    </div>
  );
}
