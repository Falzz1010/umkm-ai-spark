
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PriceAlertsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts & Monitoring</CardTitle>
        <CardDescription>
          Monitor perubahan harga kompetitor dan dapatkan notifikasi real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="competitor-url">URL Kompetitor</Label>
              <Input 
                id="competitor-url"
                placeholder="https://competitor.com/product"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="alert-threshold">Threshold Alert (%)</Label>
              <Input 
                id="alert-threshold"
                type="number"
                placeholder="10"
                className="mt-1"
              />
            </div>
          </div>
          <Button variant="outline" className="w-full">
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
