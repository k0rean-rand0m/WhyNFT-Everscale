signer=$(npx everdev signer list | grep Default | cut -d' ' -f1)
code_land="$(npx tonos-cli decode stateinit --tvc ./Land.tvc | tail -n +5 | jq -r .code)"
ownerPubkey="$(npx everdev signer info "${signer}" | jq -r .keys.public)"
input="code_land:'${code_land}'"
npx everdev contract deploy ./Map.abi.json -s Map3 --value 1000000000 --input "${input}"

#npx everdev contract run-local src/compiled/NftRoot getTotalMinted
#signer=$(npx everdev signer list | grep Default | cut -d' ' -f1)
#codeIndex="$(npx tonos-cli decode stateinit --tvc src/compiled/Index.tvc | tail -n +5 | jq -r .code)"
#codeNft="$(npx tonos-cli decode stateinit --tvc src/compiled/Nft.tvc | tail -n +5 | jq -r .code)"
#ownerPubkey="$(npx everdev signer info "${signer}" | jq -r .keys.public)"
#input="codeIndex:'${codeIndex}',codeNft:'${codeNft}',ownerPubkey:'0x${ownerPubkey}'"
#npx everdev contract deploy src/compiled/NftRoot --value 2000000000 --input "${input}"
#npx everdev contract run-local src/compiled/NftRoot getTotalMinted