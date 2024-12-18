#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      uo289715
#
# Created:     25/10/2024
# Copyright:   (c) uo289715 2024
# Licence:     <your licence>
#-------------------------------------------------------------------------------


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
    
    ns = {'ns': 'http://www.uniovi.es'}


    for tramo in root.findall('.//ns:tramo', ns):
        latitud = tramo.find('ns:latitud', ns).text
        longitud = tramo.find('ns:longitud', ns).text
        altitud = tramo.find('ns:altitud', ns).text
            
        archivo_kml.write(f'{longitud},{latitud},{altitud}\n')


def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
    """Función principal para ejecutar la transformación."""
    xml_file = input("Introduzca el archivo XML: ")
    try:
        archivo = open(xml_file,'r')
    except IOError:
        print ('No se encuentra el archivo ', xml_file)
        exit() 
    kml_file = input("Introduzca el nombre del archivo KML a crear: ")
    try:
        salida = open(kml_file + ".kml",'w')
    except IOError:
        print ('No se puede crear el archivo ', kml_file + ".kml")
        exit()
    prologoKML(salida, xml_file)   

    xml_to_kml(archivo, salida)

    epilogoKML(salida)


if __name__ == "__main__":
    main()
