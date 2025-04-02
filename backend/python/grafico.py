import sys
import matplotlib.pyplot as plt
import requests
import os
import json
import numpy as np

def generar_grafico(usuario_id):
    # Imprimir información de diagnóstico
    print(f"Generant gràfic per a l'usuari: {usuario_id}")
    print(f"Directori actual: {os.getcwd()}")
    
    # Fer una sol·licitud GET per obtenir les estadístiques de l'usuari
    url = f'http://187.33.145.98:3000/api/estadistiques/getEstadisticas/{usuario_id}'
    print(f"Consultant URL: {url}")
    
    try:
        response = requests.get(url)
        
        # Imprimir informació de la resposta
        print(f"Codi de resposta: {response.status_code}")
        
        # Verificar si la resposta és exitosa
        if response.status_code == 200:
            data = response.json()
            
            # Imprimir primers dades per diagnòstic
            print(f"Dades rebudes: {json.dumps(data)[:200]}...")
            
            # Verificar si hi ha dades
            if not data.get('data') or len(data['data']) == 0:
                print(f"No hi ha dades disponibles per a l'usuari {usuario_id}")
                return False
            
            # Extreure els números de partida, temps i puntuacions
            partidas = list(range(1, len(data['data']) + 1))
            tiempos = [item['temps'] for item in data['data']]
            puntuaciones = [item['puntuacio'] for item in data['data']]
            
            # Imprimir les dades que s'utilitzaran per al gràfic
            print(f"Partides: {partidas}")
            print(f"Temps: {tiempos}")
            print(f"Puntuacions: {puntuaciones}")
            
            # Crear figura i eixos
            fig, ax = plt.subplots(figsize=(12, 8))
            
            # Configurar l'amplada de les barres
            bar_width = 0.35
            
            # Posicions de les barres
            x = np.arange(len(partidas))
            
            # Crear barres per a temps
            tiempo_bars = ax.bar(x - bar_width/2, tiempos, bar_width, label='Temps (segons)', color='tab:blue')
            
            # Configurar eix Y primari (per a temps)
            ax.set_ylabel('Temps (segons)', fontsize=12, color='tab:blue')
            ax.tick_params(axis='y', labelcolor='tab:blue')
            
            # Crear segon eix Y per a puntuacions
            ax2 = ax.twinx()
            
            # Crear barres per a puntuacions
            puntuacion_bars = ax2.bar(x + bar_width/2, puntuaciones, bar_width, label='Puntuació', color='tab:red')
            
            # Configurar eix Y secundari (per a puntuacions)
            ax2.set_ylabel('Puntuació', fontsize=12, color='tab:red')
            ax2.tick_params(axis='y', labelcolor='tab:red')
            
            # Afegir etiquetes de l'eix X
            ax.set_xticks(x)
            ax.set_xticklabels([f'Partida {p}' for p in partidas])
            ax.set_xlabel('Número de partida', fontsize=12)
            
            # Afegir títol i reixa
            plt.title(f'Estadístiques de l\'usuari {usuario_id}: Temps i Puntuació per partida', fontsize=14)
            ax.grid(True, linestyle='--', alpha=0.3, axis='y')
            
            # Afegir valors a les barres
            def add_labels(bars, ax):
                for bar in bars:
                    height = bar.get_height()
                    ax.annotate(f'{height}',
                                xy=(bar.get_x() + bar.get_width() / 2, height),
                                xytext=(0, 3),  # 3 punts de desplaçament vertical
                                textcoords="offset points",
                                ha='center', va='bottom', fontsize=10)
            
            add_labels(tiempo_bars, ax)
            add_labels(puntuacion_bars, ax2)
            
            # Afegir llegenda combinada
            lines_labels = [
                (tiempo_bars, "Temps (segons)"),
                (puntuacion_bars, "Puntuació")
            ]
            handles, labels = zip(*lines_labels)
            ax.legend(handles, labels, loc='upper left')
            
            # Ajustar el disseny
            plt.tight_layout()
            
            # Desar el gràfic
            directorio_salida = 'graficos'
            os.makedirs(directorio_salida, exist_ok=True)
            ruta_archivo = os.path.join(directorio_salida, f'grafico_usuario_{usuario_id}.png')
            
            print(f"Desant gràfic a: {ruta_archivo}")
            plt.savefig(ruta_archivo, dpi=100, bbox_inches='tight')
            
            print(f"Gràfic generat i desat a: {ruta_archivo}")
            return True
        else:
            print(f"Error: No es van poder obtenir les estadístiques per a l'usuari {usuario_id}. Codi de resposta: {response.status_code}")
            if response.text:
                print(f"Resposta: {response.text}")
            return False
    
    except requests.exceptions.RequestException as e:
        print(f"Error de connexió: {e}")
        return False
    except Exception as e:
        print(f"Error inesperat: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Verificar que es proporcioni l'ID de l'usuari
    if len(sys.argv) < 2:
        print("Error: Heu de proporcionar l'ID de l'usuari com a argument.")
        print("Ús: python grafico.py [ID_USUARI]")
        sys.exit(1)
    
    usuario_id = sys.argv[1]
    print(f"Iniciant generació de gràfic per a l'usuari: {usuario_id}")
    exito = generar_grafico(usuario_id)
    
    # Sortir amb codi d'estat apropiat per tal que el servidor Express pugui detectar si hi va haver un error
    if exito:
        print("Procés completat amb èxit.")
        sys.exit(0)  # Èxit
    else:
        print("El procés ha fallat.")
        sys.exit(1)  # Error
