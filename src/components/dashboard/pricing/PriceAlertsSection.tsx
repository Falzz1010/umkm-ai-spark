
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PriceAlertsSection() {
  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-100">
          Price Alerts & Monitoring
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300">
          Monitor perubahan harga kompetitor dan dapatkan notifikasi real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="competitor-url" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                URL Kompetitor
              </Label>
              <Input 
                id="competitor-url"
                placeholder="https://competitor.com/product"
                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Threshold Alert (%)
              </Label>
              <Input 
                id="alert-threshold"
                type="number"
                placeholder="10"
                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-xs sm:text-sm"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs sm:text-sm px-4 py-2"
          >
            Tambah Monitoring Kompetitor
          </Button>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 text-center font-medium">
            🔄 Monitoring aktif untuk 0 kompetitor
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
