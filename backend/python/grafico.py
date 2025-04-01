import sys
import matplotlib.pyplot as plt
import requests

# Obtener el usuario que se pasa como argumento
usuario = sys.argv[1]

# Hacer una solicitud GET para obtener las estadísticas del usuario
url = f'http://localhost:3000/api/estadistiques/getEstadisticas/{usuario}'
response = requests.get(url)

# Verificar si la respuesta es exitosa
if response.status_code == 200:
    data = response.json()
    
    # Extraer los tiempos y puntuaciones
    usuarios = [item['usuari_id'] for item in data['data']]
    tiempos = [item['temps'] for item in data['data']]
    puntuaciones = [item['puntuacio'] for item in data['data']]

    # Crear un gráfico con dos ejes Y
    fig, ax1 = plt.subplots()

    # Gráfico de tiempos (eje Y izquierdo)
    color = 'tab:blue'
    ax1.set_xlabel('Usuarios')
    ax1.set_ylabel('Tiempo (segundos)', color=color)
    ax1.plot(usuarios, tiempos, color=color, marker='o', label='Tiempo')
    ax1.tick_params(axis='y', labelcolor=color)

    # Crear un segundo eje Y (derecho) para las puntuaciones
    ax2 = ax1.twinx()  
    color = 'tab:red'
    ax2.set_ylabel('Puntuación', color=color)
    ax2.plot(usuarios, puntuaciones, color=color, marker='x', label='Puntuación')
    ax2.tick_params(axis='y', labelcolor=color)

    # Añadir un título
    plt.title(f'Estadísticas del usuario {usuario}: Tiempo y Puntuación')

    # Mostrar el gráfico
    plt.show()
else:
    print(f"Error: No se pudieron obtener las estadísticas para el usuario {usuario}")
