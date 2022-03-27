signer=$(npx everdev signer list | grep Default | cut -d' ' -f1)
code_land="$(npx tonos-cli decode stateinit --tvc ./Land.tvc | tail -n +5 | jq -r .code)"
ownerPubkey="$(npx everdev signer info "${signer}" | jq -r .keys.public)"
input="code_land:'${code_land}'"
npx everdev contract deploy ./Map.abi.json -s ${signer} -n dev --value 1000000000 --input "${input}"