
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PriceAlertsSection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Price Alerts & Monitoring</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Monitor perubahan harga kompetitor dan dapatkan notifikasi real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competitor-url" className="text-sm font-medium">URL Kompetitor</Label>
              <Input 
                id="competitor-url"
                placeholder="https://competitor.com/product"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold" className="text-sm font-medium">Threshold Alert (%)</Label>
              <Input 
                id="alert-threshold"
                type="number"
                placeholder="10"
                className="w-full"
              />
            </div>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Tambah Monitoring Kompetitor
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔄 Monitoring aktif untuk 0 kompetitor
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
