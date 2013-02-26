package com;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.webapp.WebAppContext;

public final class JettyServer {
	private static Server server = new Server();

	private JettyServer() {

		final SocketConnector connector = new SocketConnector();
		connector.setPort(7501);
		server.setConnectors(new Connector[] { connector });
		final Context root = new Context(server, "/embed", Context.SESSIONS);
		root.addServlet(new ServletHolder(new DiffServlet()), "/diff");
	}

	public static void main(final String[] args) {

		new JettyServer();
		final WebAppContext ctx = new WebAppContext();
		ctx.setServer(server);
		ctx.setContextPath("/");
		ctx.setWar("./webapp");
		server.addHandler(ctx);
		try {
			server.start();
			server.join();
		} catch (Exception e) {
			java.util.logging.Logger.getLogger(JettyServer.class.getName())
					.log(java.util.logging.Level.SEVERE, null, e);
		}
	}

}