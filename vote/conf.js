module.exports = 
process.env.NODE_ENV === 'production' ?
{
    appid:'wx48d1feb0c7dda3f4',
    appsecret:'6c69042c06e43568b9c742a9b499e44f',
    token:'sofiya',
    encodingAESKey: 'EnWTNZiEz0LmBG3fyuPiTnyQx3MNBMyTBkFl6JbHlW4',
    port: 3000,
}
:
{
    appid:'wx48d1feb0c7dda3f4',
    appsecret:'6c69042c06e43568b9c742a9b499e44f',
    token:'sofiya',
    port: 3000,
}
;