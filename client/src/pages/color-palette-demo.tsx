import React from 'react';
import { PublicLayout } from '../components/layout/public-layout';
import { useColorContext } from '../contexts/color-context';
import ColorPaletteSelector from '../components/color-palette-selector';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function ColorPaletteDemo() {
  const { currentPalette, currentCategory } = useColorContext();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Color Palette Harmonizer - Briki</title>
        <meta name="description" content="Experience dynamic color theming that adapts to context while ensuring visual harmony and accessibility." />
      </Helmet>
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4" style={{ color: currentPalette.primary }}>
                Contextual Color Palette Harmonizer
              </h1>
              <p className="text-xl" style={{ color: currentPalette.text }}>
                Experience dynamic color theming that adapts to context while ensuring visual harmony
              </p>
            </motion.div>
          </div>
          
          <div className="space-y-8">
            <ColorPaletteSelector />
            
            <Card>
              <CardHeader>
                <CardTitle>Current Settings</CardTitle>
                <CardDescription>Active palette configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Theme:</span>
                    <Badge>{currentCategory}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Primary Color:</span>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: currentPalette.primary }}
                      ></div>
                      <span>{currentPalette.primary}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: currentPalette.text }}>UI Component Preview</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button style={{ backgroundColor: currentPalette.primary, color: 'white' }}>Primary Button</Button>
                      <Button style={{ backgroundColor: currentPalette.secondary, color: 'white' }}>Secondary Button</Button>
                      <Button variant="outline" style={{ borderColor: currentPalette.primary, color: currentPalette.primary }}>
                        Outline Button
                      </Button>
                      <Button variant="ghost" style={{ color: currentPalette.primary }}>Ghost Button</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Alerts</h3>
                    <div className="space-y-4">
                      <Alert variant="default" style={{ borderColor: currentPalette.info }}>
                        <Info className="h-4 w-4" style={{ color: currentPalette.info }} />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>This is an information message using the current theme.</AlertDescription>
                      </Alert>
                      
                      <Alert variant="default" style={{ borderColor: currentPalette.success }}>
                        <CheckCircle className="h-4 w-4" style={{ color: currentPalette.success }} />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Operation completed successfully!</AlertDescription>
                      </Alert>
                      
                      <Alert variant="default" style={{ borderColor: currentPalette.warning }}>
                        <AlertTriangle className="h-4 w-4" style={{ color: currentPalette.warning }} />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>Please review this information before proceeding.</AlertDescription>
                      </Alert>
                      
                      <Alert variant="default" style={{ borderColor: currentPalette.error }}>
                        <AlertCircle className="h-4 w-4" style={{ color: currentPalette.error }} />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>There was a problem with your request.</AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader style={{ backgroundColor: currentPalette.background }}>
                          <CardTitle style={{ color: currentPalette.primary }}>Featured Plan</CardTitle>
                          <CardDescription>Recommended for most users</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">This plan includes comprehensive coverage for all your needs.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="ghost">Learn More</Button>
                          <Button style={{ backgroundColor: currentPalette.primary, color: 'white' }}>Select Plan</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader style={{ backgroundColor: currentPalette.background }}>
                          <CardTitle style={{ color: currentPalette.primary }}>Premium Plan</CardTitle>
                          <CardDescription>For advanced users</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Our premium tier with extended coverage and priority support.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="ghost">Learn More</Button>
                          <Button style={{ backgroundColor: currentPalette.primary, color: 'white' }}>Select Plan</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: currentPalette.text }}>Typography</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: currentPalette.background }}>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: currentPalette.primary }}>Heading 1</h1>
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: currentPalette.text }}>Heading 2</h2>
                    <h3 className="text-xl font-medium mb-2" style={{ color: currentPalette.text }}>Heading 3</h3>
                    <p className="mb-2" style={{ color: currentPalette.text }}>
                      This is a paragraph with the primary text color. The contextual color harmonizer ensures
                      that text remains readable across different themes and accessibility settings.
                    </p>
                    <p className="text-sm" style={{ color: currentPalette.muted }}>
                      This is smaller muted text that's perfect for captions or secondary information.
                    </p>
                    <a href="#" className="inline-block mt-2" style={{ color: currentPalette.primary }}>
                      This is a hyperlink styled with the primary color
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <div className="rounded-lg p-6" style={{ 
                  background: `linear-gradient(to right, ${currentPalette.primary}, ${currentPalette.secondary})`,
                  color: 'white'
                }}>
                  <h2 className="text-2xl font-bold mb-2">Color Harmony in Action</h2>
                  <p className="text-lg mb-4">
                    See how all UI elements maintain perfect harmony while adapting to different contexts.
                  </p>
                  <div className="flex space-x-2">
                    <Button className="bg-white hover:bg-gray-100" style={{ color: currentPalette.primary }}>
                      Learn More
                    </Button>
                    <Button style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      border: '1px solid white',
                      color: 'white' 
                    }}>
                      Contact Us
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}