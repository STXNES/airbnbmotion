from gmail_sender import send_email

send_email(
    to_email="axel.rojas2502@gmail.com",
    subject="Prueba Airbnb Pipeline",
    html="""
    <h2>Hola Axel</h2>

    <p>Si recibes este correo significa que Gmail API está funcionando correctamente.</p>

    <p>🚀 Airbnb Pipeline listo.</p>
    """
)

print("Correo enviado correctamente.")