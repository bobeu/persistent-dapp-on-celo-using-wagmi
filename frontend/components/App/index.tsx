import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ConnectKitButton } from 'connectkit';
import { CardComponent } from './CardComponent';
import { Spinner } from '../Spinner';
import sendTransaction from '../apis';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { getEllipsisTxt } from '../helpers/formatters';

const theme = createTheme();

export default function App() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<number>(0);
  const [value, setValue] = React.useState<number>(0);
  const [allowance, setAllowance] = React.useState<BigNumber>(BigNumber(0));
  const [balance, setBalance] = React.useState<BigNumber>(BigNumber(0));
  const [errorMessage, setError] = React.useState<any>("");

  const { address, connector } = useAccount();

  const setallowance = (x:BigNumber) => setAllowance(x)
  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setValue(Number(e.target.value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setAmount(Number(e.target.value));
  };

  React.useEffect(() => {
    if(errorMessage === 'execution reverted: Already Claimed'){
      setTimeout(() => {
        setError(balance)
      }, 7000);
    }
  }, [errorMessage, balance]);

  const handleClick = async(functioName: string, flag?:boolean) => {
    if(flag && functioName !== 'approve' && amount === 0) return alert('Please enter amount');
    if(functioName === 'deposit') {
      if(value === 0) return alert('Please set value');
    }
    setLoading(true);
    const provider = await connector?.getProvider();
    
    try {
      const amt = BigNumber(amount);
      const val = BigNumber(value);
      await sendTransaction({
        functionName: functioName,
        providerOrSigner: provider,
        amount: ethers.utils.hexValue(ethers.utils.parseUnits(amt.toString())),
        cancelLoading: () => setLoading(false),
        account: address,
        value: ethers.utils.hexValue(ethers.utils.parseUnits(val.toString()))
      }).then((rec) => {
        (rec.read && functioName === 'allowance') && setallowance(rec.read);
        (rec.read && functioName === 'balance') && setBalance(rec.read);
      });
    } catch (error: any) {
      console.log("Error1", error?.reason);
      setError(error?.reason);
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: '',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="rgb(150, 150, 150)"
              gutterBottom
              mt={2}
            >
              Decentralized Token swap powered by Celo
            </Typography>
            <Typography variant="h6" align="center" color="rgba(150, 150, 150, 0.7)" paragraph>
              Exchange ERC20 compatible token for $CELO
            </Typography>
            <Typography variant="overline" align="center" color="green" paragraph>
              Built by <span style={{color: 'rgba(170, 170, 170, 0.9)'}}><a href="https://github.com/bobeu/">Isaac J.</a></span> for the love of Celo - #celosage
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <ConnectKitButton />
              <Button variant="outlined">
                <Link color="rgba(150, 150, 150, 0.8)" sx={{
                  '&:hover': {
                    border: 'rgba(100, 100, 100, 0.5)'
                  }
                }} href="https://github.com/bobeu/feature-rich-persistent-dapp-on-celo-using-wagmi" underline='none'>Source code</Link> 
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardComponent
                step='Step 1'
                heading='Self Drop'
                isButton_1_display={true}
                isButton_2_display={true}
                button_1_name={'Claim'}
                button_2_name={'Get Balance'}
                handleButton_1_Click={() => handleClick('claim')}
                handleButton_2_Click={() => handleClick('balance')}
                displayChild={loading}
                description={`CELOG Balance: ${balance.toString() > '0'? getEllipsisTxt(balance.toString(), 4) : errorMessage}`}
              >
                <Spinner color={'white'} />
              </CardComponent>
            </Grid>
            <Grid item xs={12} md={4}>
              <CardComponent
                step='Step 2'
                heading='Set Approval'
                isButton_1_display={true}
                isButton_2_display={true}
                isButton_3_display={true}
                button_1_name={'Approve'}
                button_2_name={'Get'}
                button_3_name={'reduce'}
                handleButton_1_Click={() => handleClick('approve', true)}
                handleButton_2_Click={() => handleClick('allowance')}
                handleButton_3_Click={() => handleClick('clearAllowance')}
                displayChild={loading}
                displayTextfield={true}
                handleTextfieldChange={handleAmountChange}
                description={`Allowance: ${allowance.toString() > '0' ? getEllipsisTxt(allowance.toString(), 4) : '0.00'}`}
              >
                <Spinner color={'white'} />
              </CardComponent>
            </Grid>

            <Grid item xs={12} md={4}>
              <CardComponent
                step='Step 3'
                heading='Swap ERC20 to $CELO'
                isButton_1_display={true}
                isButton_2_display={true}
                button_1_name={'Swap'}
                button_2_name={'Deposit test Celo'}
                handleButton_1_Click={() => handleClick('swap')}
                handleButton_2_Click={() => handleClick('deposit')}
                displayChild={loading}
                description={''}
                displayTextfield={true}
                handleTextfieldChange={handleValueChange}
              >
                <Spinner color={'white'} />
              </CardComponent>
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}