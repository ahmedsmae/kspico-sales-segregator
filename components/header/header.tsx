import React from 'react';
import Link from 'next/link';
import { Grid, Text, Button } from '@geist-ui/react';
import { Layers, Percent, Users } from '@geist-ui/react-icons';

const Header = () => {
  return (
    <Grid.Container
      gap={1}
      alignItems='center'
      style={{
        borderBottom: '1px solid #cccccc50',
        margin: 'auto',
        width: '90%'
      }}
    >
      <Grid xs>
        <Link href='/'>
          <a>
            <Text p b>
              KSPICO : <span style={{ color: 'tomato' }}>SALES SEGREGATOR</span>
            </Text>
          </a>
        </Link>
      </Grid>

      <Grid>
        <Link href='/percentage-distribution'>
          <a>
            <Button type='abort' auto icon={<Percent />}>
              Distribution
            </Button>
          </a>
        </Link>
      </Grid>

      <Grid>
        <Link href='/items'>
          <a>
            <Button type='abort' auto icon={<Layers />}>
              Items
            </Button>
          </a>
        </Link>
      </Grid>

      <Grid>
        <Link href='/reps'>
          <a>
            <Button type='abort' auto icon={<Users />}>
              Reps
            </Button>
          </a>
        </Link>
      </Grid>
    </Grid.Container>
  );
};

export default Header;
