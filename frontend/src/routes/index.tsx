import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { useState } from 'react';
import { QRCode } from '@/components/qr-code';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { allQrCodeQueryOptions, queryClient } from '@/query';

export const Route = createFileRoute('/')({
  component: App,
})



function App() {

  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(url);
    // save the qr settings somewhere
    // store the qr code in the query client
    queryClient.setQueryData(allQrCodeQueryOptions.queryKey, (oldData) => [
      ...(oldData || []),
      {
        id: crypto.randomUUID(),
        url,
        // style: 'dots',
      }
    ])
  }

  return (
    <div>
      <h1>QR Code Example</h1>
      <QRCode url={url} />

      <form onSubmit={handleSubmit}>
        <Input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button type="submit">Generate QR Code</Button>
      </form>
    </div>
  );
}


