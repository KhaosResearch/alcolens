#!/bin/sh

# 1. Esperar a que Jasmin (puerto 1401) esté listo
echo "Esperando a que Jasmin arranque..."
while ! nc -z jasmin 1401; do   
  sleep 1
done
echo "Jasmin detectado. Iniciando configuración..."

# 2. Enviar comandos de configuración vía Telnet automáticamente
# Usuario por defecto de Jasmin: jcliadmin / jclipwd
(
echo "jcliadmin"
echo "jclipwd"
sleep 1

# --- CREAR GRUPO ---
echo "group -a customers"
echo "gid customers"
echo "ok"

# --- CREAR USUARIO (El que usa tu Next.js) ---
echo "user -a"
echo "username foo"
echo "password bar"
echo "gid customers"
echo "uid foo"

# --- DAR CRÉDITO INFINITO (Para evitar errores de 'insufficient credit') ---
echo "mt_messaging_cred quota 0" # 0 significa ilimitado en algunas versiones, o ponemos un numero alto
echo "smpps_cred quota 0" 

# --- ACTIVAR USUARIO ---
echo "enable"
echo "ok"

# --- GUARDAR CAMBIOS EN DISCO ---
echo "persist"
echo "exit"
) | nc jasmin 1401

echo "Configuración de Jasmin completada con éxito."