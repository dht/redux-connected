cd packages

cd redux-connected
yarn unlink
yarn link

cd ../redux-connected-devtools
yarn unlink
yarn link
yarn link redux-store-connected

cd ../redux-connected-components
yarn unlink
yarn link
yarn link redux-store-connected

cd ../redux-connected-examples/client
yarn link redux-connected
yarn link redux-devtools
yarn link redux-components

