cd packages

cd redux-connected
yarn unlink
yarn link
yarn link redux-store-generator

cd ../redux-connected-devtools
yarn unlink
yarn link
yarn link redux-connected

cd ../redux-connected-components
yarn unlink
yarn link
yarn link redux-store-generator
yarn link redux-connected

cd ../redux-connected-examples/client
yarn link redux-connected
yarn link redux-connected-devtools
yarn link redux-connected-components

