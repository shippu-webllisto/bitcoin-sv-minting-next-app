import { Spinner } from 'flowbite-react';
import React from 'react';

export default function Spinner_() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-center">
        <Spinner color="failure" aria-label="Center-aligned spinner example" />
      </div>
    </div>
  );
}
