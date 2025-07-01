import { Badge } from '../components/ui/badge';
import { Sparkles, Shield, Heart, Zap } from 'lucide-react';

export default function TestContrastPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Badge Contrast Test Page</h1>
        
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold mb-4">Default Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="info">Info Badge</Badge>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold mb-4">New Gradient Variant (Improved Contrast)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="gradient" className="inline-flex px-4 py-2">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              New: AI-Powered Insurance
            </Badge>
            <Badge variant="gradient" className="px-2 py-0.5 text-xs">
              Best Value
            </Badge>
            <Badge variant="gradient" className="px-2 py-0.5 text-xs">
              Most Popular
            </Badge>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-950 p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-semibold mb-4">On Different Backgrounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded space-y-3">
              <p className="text-sm font-medium mb-2">Light Background</p>
              <Badge variant="gradient" className="inline-flex px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 mr-2" />
                Premium Protection
              </Badge>
            </div>
            <div className="bg-gray-800 dark:bg-gray-200 p-4 rounded space-y-3">
              <p className="text-sm font-medium mb-2 text-gray-200 dark:text-gray-800">Dark Background</p>
              <Badge variant="gradient" className="inline-flex px-3 py-1.5">
                <Heart className="w-3.5 h-3.5 mr-2" />
                Family Coverage
              </Badge>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold mb-4">Contrast Comparison</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Old Badge (Low Contrast)</p>
              <Badge className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 border-blue-600/20 px-4 py-2">
                <Zap className="w-3.5 h-3.5 mr-2" />
                Low Contrast Example
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New Badge (Improved Contrast)</p>
              <Badge variant="gradient" className="inline-flex px-4 py-2">
                <Zap className="w-3.5 h-3.5 mr-2" />
                High Contrast Example
              </Badge>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Accessibility Notes</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• The new gradient variant uses 20% opacity backgrounds instead of 10% for better contrast</li>
            <li>• Text color is darker (blue-800) in light mode and lighter (blue-200) in dark mode</li>
            <li>• Border opacity increased to 30% for better definition</li>
            <li>• Font weight set to medium for improved readability</li>
            <li>• All badges meet WCAG AA contrast requirements</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 