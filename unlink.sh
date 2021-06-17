cd packages

cd redux-connected
yarn unlink
yarn unlink redux-store-generator

cd ../redux-connected-devtools
yarn unlink
yarn unlink redux-connected

cd ../redux-connected-components
yarn unlink
yarn unlink redux-store-generator
yarn unlink redux-connected

cd ../redux-connected-example-client
yarn unlink redux-connected
yarn unlink redux-connected-devtools
yarn unlink redux-connected-components

