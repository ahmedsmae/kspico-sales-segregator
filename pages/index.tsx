import { Card, Page, Text } from '@geist-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { findAllXlsxFileNames } from '../utils/file-manipulators';

interface HomePageProps {
  filenames: Array<string>;
}

const HomePage: NextPage<HomePageProps> = ({ filenames }) => {
  const renderFilename = (filename: string) => {
    return (
      <Link key={filename} href={`/files/${filename}`}>
        <a>
          <Card hoverable margin={1}>
            <Text p b>
              {filename}
            </Text>
          </Card>
        </a>
      </Link>
    );
  };

  return (
    <Page>
      <Text h1>Available Sales Files</Text>
      <Text p b>
        Select one of the following files below.
      </Text>
      {filenames.map(renderFilename)}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> =
  async context => {
    const filenames = findAllXlsxFileNames();
    return { props: { filenames } };
  };

export default HomePage;
