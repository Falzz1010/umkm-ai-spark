
import { EnhancedAIAssistant } from './EnhancedAIAssistant';

interface TabAIProps {
  products: any[];
  onGenerationComplete: () => void;
}

export function TabAI({ products, onGenerationComplete }: TabAIProps) {
  return <EnhancedAIAssistant products={products} onGenerationComplete={onGenerationComplete} />;
}
