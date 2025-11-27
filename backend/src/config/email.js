import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'wearegymconnect@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'nubobnqorphifdxk'
  }
});

export const enviarEmailAprobacion = async (datosProfesor) => {
  const { nombre, email_personal, email_corporativo, password_temporal } = datosProfesor;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'wearegymconnect@gmail.com',
    to: email_personal,
    subject: '🎉 Tu solicitud como Profesor en GymConnect fue aprobada',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">GymConnect</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #00ff87; margin-top: 0;">¡Felicidades, ${nombre}!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Tu solicitud para ser profesor en <strong>GymConnect</strong> ha sido aprobada exitosamente.
          </p>
          
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">📧 Tus credenciales:</h3>
            <p><strong>Email:</strong> <code style="background: white; padding: 8px; border-radius: 4px;">${email_corporativo}</code></p>
            <p><strong>Contraseña temporal:</strong> <code style="background: white; padding: 8px; border-radius: 4px;">${password_temporal}</code></p>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center;">GymConnect Team</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};

export default transporter;
