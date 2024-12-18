import xml.etree.ElementTree as ET

def xml_to_kml(xml_file, archivo_kml):
    """Función para transformar un archivo XML de circuito a KML."""
    try:
        
        tree = ET.parse(xml_file)
        
    except IOError:
        print ('No se encuentra el archivo ', xml_file)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", xml_file)
        exit()        
        
    root = tree.getroot()
    
    namespace  = {'ns': 'http://www.uniovi.es'}
    tramos = root.findall('ns:tramos/ns:tramo', namespaces=namespace)


    puntos = []
    distancia_acumulada = 0

    for tramo in tramos:
        # Extraer distancia y altitud de cada tramo
        distancia = float(tramo.get('distancia', '0'))
        altitud = float(tramo.find('ns:altitud', namespaces=namespace).text)
        
        # Acumular la distancia total
        distancia_acumulada += distancia
        
        # Calcular coordenadas para el SVG
        x = int(distancia_acumulada / 6)  # Escalado de la distancia en x
        y = int(2000 - (altitud * 12))    # Escalado inverso de la altitud en y
        
        # Almacenar el punto
        puntos.append(f"{x},{y}")

    # Agregar el punto inicial al final para cerrar el circuito
    
    puntos_str = " ".join(puntos)

    svg_content = f'''<polyline points="
        {puntos_str}"
        style="fill:white;stroke:red;stroke-width:4" />''' 
    archivo_kml.write(svg_content)


def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0" width="1500" height="3000">\n')
   

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo SVG"""

    archivo.write("</svg>")

def main():
    """Función principal para ejecutar la transformación."""
    xml_file = input("Introduzca el archivo XML: ")
    try:
        archivo = open(xml_file,'r')
    except IOError:
        print ('No se encuentra el archivo ', xml_file)
        exit() 
    kml_file = input("Introduzca el nombre del archivo SVG a crear: ")
    try:
        salida = open(kml_file + ".svg",'w')
    except IOError:
        print ('No se puede crear el archivo ', kml_file + ".svg")
        exit()
    prologoKML(salida, xml_file)   

    xml_to_kml(archivo, salida)

    epilogoKML(salida)


if __name__ == "__main__":
    main()
