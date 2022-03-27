signer=$(everdev s l | grep Default | cut -d' ' -f1)
ownerPubkey="$(everdev s i "${signer}" | jq -r .keys.public)"

code_land="$(tonos-cli decode stateinit --tvc ./Land.tvc | tail -n +5 | jq -r .code)"
code_map="$(tonos-cli decode stateinit --tvc ./Map.tvc | tail -n +5 | jq -r .code)"

input="code_land:'${code_land}',code_map:'$code_map'"
everdev contract deploy ./GameMaster.abi.json -s ${signer} -n dev --value 1000000000 --input "${input}"