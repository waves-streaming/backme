import { isValidHandle, useCreateProfile } from '@lens-protocol/react-web';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';

export function CreateTestProfile() {
  const [handle, setHandle] = useState(''); // Initialize with an empty string
  const { execute: create, error, isPending } = useCreateProfile();

  const onSubmit = async () => {
 

    await create("pppoopoo");
  };

  return (
    <Button onClick={onSubmit}>Profile</Button>
  );
}
