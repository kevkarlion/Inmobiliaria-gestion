import React from 'react';
import PropertyPageDetail from '@/components/shared/PropertyPageDetail/PropertyPageDetail'

interface PageProps {
  params: {
    slug: string;
  }
}

const Page = ({ params }: PageProps) => {
  return (
    <div>
      <PropertyPageDetail params={params} />
    </div>
  );
}

export default Page;
