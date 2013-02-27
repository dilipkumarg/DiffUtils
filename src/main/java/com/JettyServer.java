package main.java.com;

import java.awt.event.*;
import java.util.logging.*;
import javax.swing.*;
import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.webapp.WebAppContext;

public final class JettyServer implements ActionListener {
	private static Server server = new Server();
	static Logger logger = Logger.getLogger(JettyServer.class.getName());
	JButton startbtn, stopbtn;
	JTextArea text;
	JFrame frame;
	JLabel title;
	JScrollPane scrollpane;

	private JettyServer() {
		frame = new JFrame("server");
		title = new JLabel("JETTY SERVER");
		text = new JTextArea(5, 20);
		scrollpane = new JScrollPane(text);
		startbtn = new JButton("START");
		stopbtn = new JButton("STOP");
		addToContainer();
		startbtn.addActionListener(this);
		stopbtn.addActionListener(this);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(300, 250);
	}

	public void addToContainer() {
		frame.setLayout(null);
		frame.add(title);
		title.setBounds(100, 20, 100, 20);
		frame.getContentPane().add(scrollpane);
		scrollpane.setBounds(50, 50, 200, 100);
		frame.add(startbtn);
		startbtn.setBounds(60, 160, 80, 20);
		frame.add(stopbtn);
		stopbtn.setBounds(160, 160, 80, 20);
		stopbtn.setEnabled(false);
	}

	public void init() {
		final SocketConnector connector = new SocketConnector();
		connector.setPort(7501);
		server.setConnectors(new Connector[] { connector });
		final Context root = new Context(server, "/embed", Context.SESSIONS);
		root.addServlet(new ServletHolder(new DiffServlet()), "/diff");
	}

	public void start() {
		init();
		final WebAppContext ctx = new WebAppContext();
		ctx.setServer(server);
		ctx.setContextPath("/");
		ctx.setWar("./src/main/webapp");
		server.addHandler(ctx);
		try {
			server.start();
		} catch (Exception e) {
			logger.log(Level.SEVERE, "error in starting server", e);
		}
	}

	public void stop() {
		try {
			server.stop();
			System.err.print("server stopped\n");
		} catch (Exception e) {
			logger.log(Level.SEVERE, "error in stoping server", e);
		}
	}

	public static void main(final String[] args) {
		new JettyServer();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == startbtn) {
			text.append("Server started\n");
			startbtn.setEnabled(false);
			stopbtn.setEnabled(true);
			start();
		} else {
			text.append("Server stopped\n");
			stopbtn.setEnabled(false);
			startbtn.setEnabled(true);
			stop();
		}
	}
}