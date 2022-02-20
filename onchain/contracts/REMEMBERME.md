Compile contracts:
```
everdev sol compile ./Map.sol
everdev sol compile ./Land.sol
```

Create signer: `everdev s g Map`

Topup account: `everdev contract topup ./Map.abi.json -v 1000000000 -s Map`

Change "Map" in `./deploy.sh`

Deploy contract:
`./deploy.sh`

`everdev contract deploy ./Map.abi.json -s Map` (raw)
