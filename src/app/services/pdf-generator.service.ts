import { Injectable } from '@angular/core';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }
//`${new Date().toISOString()}_tutorial.pdf`
  generatePdfgeneral(data: any[]) {
    const pdf = new PdfMakeWrapper();

    pdf.info({
      title: `Reporte ${new Date().toISOString()}`
    });

    pdf.add(
      new Txt(`Historial al ${new Date().toLocaleDateString('es-AR')}`)
        .fontSize(16)
        .bold()
        .margin([0, 0, 0, 10])
        .end
    );

    const formattedData = data.map(item => ({
      ...item,
      fecha: new Date(item.fecha).toLocaleDateString('es-AR')
    }));

    pdf.add(
      new Table([
        ['Depto', 'Fecha', 'Equipo', 'Descripción', 'Estado'],
        ...formattedData.map(item => [item.departamento, item.fecha, item.equipo, item.descripcion, item.estadoActual])
      ])
        .layout('lightHorizontalLines') // Optional: Add horizontal lines to separate the rows
        .end
    );

    pdf.create().open();
  }

  generatePdf(data: any[],user: string) {
    const pdf = new PdfMakeWrapper();
    user = user.toUpperCase();

    pdf.info({
      title: `Reporte ${new Date().toISOString()}`
    });

    pdf.add(
      new Txt(`Historial al ${new Date().toLocaleDateString('es-AR')} perteneciente a ${user}`)
        .fontSize(16)
        .bold()
        .margin([0, 0, 0, 10])
        .end
    );

    const formattedData = data.map(item => ({
      ...item,
      fecha: new Date(item.fecha).toLocaleDateString('es-AR')
    }));

    pdf.add(
      new Table([
        ['Fecha', 'Equipo', 'Descripción', 'Estado'],
        ...formattedData.map(item => [item.fecha, item.equipo, item.descripcion, item.estadoActual])
      ])
        .layout('lightHorizontalLines') // Optional: Add horizontal lines to separate the rows
        .end
    );

    pdf.create().open();
  }


  generateInventario(data: any[]){
    const pdf = new PdfMakeWrapper();

    pdf.info({
      title: `Inventario ${new Date().toISOString()}`
    });

    pdf.add(
      new Txt(`Equipamiento cargado al ${new Date().toLocaleDateString('es-AR')}`)
        .fontSize(16)
        .bold()
        .margin([0, 0, 0, 10])
        .end
    );

    const formattedData = data.map(item => ({
      ...item,
      fecha: new Date(item.fecha).toLocaleDateString('es-AR')
    }));

    pdf.add(
      new Table([
        ['Equipo', 'Descripcion', 'Ubicación', 'Inventario'],
        ...formattedData.map(item => [item.nombre, item.comentario, item.usuario.userName, item.inventario])
      ])
        .layout('lightHorizontalLines') // Optional: Add horizontal lines to separate the rows
        .end
    );

    pdf.create().open();
  }



}
