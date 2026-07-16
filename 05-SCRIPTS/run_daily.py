import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Definir las rutas relativas de los scripts
SCRIPTS = [
    {
        "name": "Paso 1: Leer Respuestas (read_replies.py)",
        "path": ROOT / "05-SCRIPTS" / "Gmail_API" / "read_replies.py"
    },
    {
        "name": "Paso 2: Enviar Seguimientos (auto_followup.py)",
        "path": ROOT / "05-SCRIPTS" / "Email" / "auto_followup.py"
    },
    {
        "name": "Paso 3: Enviar Nuevos Correos (send_pipeline.py)",
        "path": ROOT / "05-SCRIPTS" / "Email" / "send_pipeline.py"
    }
]

def print_header(title):
    print("\n" + "="*60)
    print(f"🚀 {title}")
    print("="*60)

def main():
    print_header("INICIANDO AUTOPILOT DE AIRBNB")
    print("Por favor, no cierres esta ventana hasta que termine el proceso.\n")
    
    for script in SCRIPTS:
        print(f"\n⏳ Ejecutando: {script['name']}...")
        
        if not script["path"].exists():
            print(f"❌ ERROR: No se encontró el archivo {script['path']}")
            print("Abortando la ejecución diaria para evitar errores en la base de datos.")
            sys.exit(1)
            
        try:
            # Usar sys.executable asegura que se use el mismo entorno de Python (venv)
            result = subprocess.run(
                [sys.executable, str(script["path"])],
                check=True,
                cwd=str(ROOT),
                text=True
            )
            print(f"✅ Completado: {script['name']}")
        except subprocess.CalledProcessError as e:
            print(f"❌ FALLÓ: {script['name']} ha fallado con código de error {e.returncode}")
            print("Abortando la ejecución de los siguientes pasos para evitar enviar correos equivocados.")
            sys.exit(1)
            
        # Pequeña pausa entre scripts
        time.sleep(2)

    print_header("🎉 AUTOPILOT COMPLETADO CON ÉXITO")
    print("Se han leído las respuestas, enviado los seguimientos y enviado los nuevos correos.")
    print("Ya puedes cerrar esta ventana y apagar tu computadora si lo deseas.")
    print("\nEsta ventana se cerrará automáticamente en 30 segundos...")
    time.sleep(30)

if __name__ == "__main__":
    main()
